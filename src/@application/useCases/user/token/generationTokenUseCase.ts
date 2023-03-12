import { TokenIDValueObject } from '@domain/token/valueObjects/tokenIDValueObject'
import { useCases } from '@application/useCases/useCases'
import { Result } from '@domain/shared/core'
import { type ResponseToken, type IGenerationTokenDTO } from './generationTokenDTO'
import { TokenEncryptedValueObject } from '@domain/token/valueObjects/TokenEncryptedValueObject'
import { TokenUserAggregate } from '@domain/token/aggregates/tokenUserAggregate'
import { ITokenRepositoryContract } from '@domain/contracts/repositories/tokenRepository.contract'
import { Inject } from '@nestjs/common'

export class GenerationTokenUseCase extends useCases<IGenerationTokenDTO, ResponseToken> {
  public constructor (
    @Inject('ITokenRepositoryContract')
    private readonly tokenRepository: ITokenRepositoryContract
  ) {
    super('GenerationTokenUseCase')
  }

  public async run ({ user, userAgent }: IGenerationTokenDTO): Promise<Result<ResponseToken>> {
    const generationToken = TokenIDValueObject.create()
    const crypto = TokenEncryptedValueObject.encrypt(user.id.toString())

    const validsParamsTokenOrError = Result.combine([generationToken, crypto])
    if (validsParamsTokenOrError.isFailure) {
      return Result.fail<ResponseToken>(validsParamsTokenOrError.error)
    }

    const createParamDeviceComplet = `
        ${(userAgent.name.toLowerCase())[0].toUpperCase()} - 
        ${(userAgent.os.toLowerCase())[0].toUpperCase()}:
        ${(userAgent.type.toLowerCase())[0].toUpperCase()}
    `
    const instanceOfUserToken = TokenUserAggregate.create({
      createdAt: new Date(),
      device: createParamDeviceComplet,
      token: crypto.getResult()
    }, generationToken.getResult().id).getResult()

    void this.tokenRepository.save(instanceOfUserToken)

    return Result.ok<ResponseToken>({
      token: instanceOfUserToken.token.value
    })
  }
}
