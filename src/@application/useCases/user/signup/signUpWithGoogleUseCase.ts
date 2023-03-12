/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
import { useCases } from '@application/useCases/useCases'
import { type IConsoleGoogleAuthContract } from '@domain/contracts/http/consoleGoogle.contract'
import { IUserRepositoryContract } from '@domain/contracts/repositories/userRepository.contract'
import { Result } from '@domain/shared/core'
import { DateCommonValueObject, IpValueObject, PasswordValueObject, TermsValueObject, UserAggregate } from '@domain/user'

import { Inject } from '@nestjs/common'
import { type ISignUpDTO } from './signupDTO'

export class SignUnWithGoogle extends useCases<ISignUpDTO.google> {
  public constructor (
    @Inject('IConsoleGoogleAuthContract')
    private readonly consoleGoogle: IConsoleGoogleAuthContract,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepositoryContract
  ) {
    super('SignUpWithGoogle')
  }

  public async run (props: ISignUpDTO.google): Promise<Result<void>> {
    if (props.token === null || props.token === '' || props.token === undefined) {
      return Result.fail<void>('User account not found')
    }

    const googleProfileOrError = await this.consoleGoogle.auth(props.token)
    if (!googleProfileOrError) {
      return Result.fail<void>('User account not found')
    }

    const alreadyExistsForEmail = await this.userRepository.exist({ email: googleProfileOrError.email.value })
    const getUserByEmailAndUpdated = await this.userRepository.findOne({ email: googleProfileOrError.email.value })

    // Se existir um perfil com o mesmo email
    if (alreadyExistsForEmail === true && getUserByEmailAndUpdated !== null) {
      getUserByEmailAndUpdated.insertGoogleProfile = googleProfileOrError
      await this.userRepository.updatedGoogleID(getUserByEmailAndUpdated.id.toString(), googleProfileOrError.id.toString())
    } else {
      // Validar os DTO e se ocorreu um erro retornar
      const ipOrError = IpValueObject.create(props.ip)
      const accepetAtOrError = DateCommonValueObject.create(new Date())
      const termsOrError = TermsValueObject.create({
        acceptedAt: accepetAtOrError.getResult(),
        ip: ipOrError.getResult(),
        userAgent: {
          name: props.userAgent.name,
          os: props.userAgent.os,
          type: props.userAgent.type,
          version: props.userAgent.version
        }
      })
      if (termsOrError.isFailure) return Result.fail<void>(termsOrError.error.toString())

      // Validar os erros acima
      const userOrError: Result<UserAggregate> = UserAggregate.create({
        email: googleProfileOrError.email,
        password: PasswordValueObject.create('', true).getResult(),
        googleProfile: googleProfileOrError,
        terms: [termsOrError.getResult()]
      })

      await this.userRepository.save(userOrError.getResult())
    }

    return Result.ok<void>()
  }
}
