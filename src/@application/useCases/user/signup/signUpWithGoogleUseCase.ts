import { useCases } from '@application/useCases/useCases'
import { Result } from '@domain/shared/core'
import { type ISignUpDTO } from './signupDTO'

export class SignUnWithGoogle extends useCases<ISignUpDTO.google> {
  public constructor () {
    super('SignUpWithGoogle')
  }

  public async run ({ token }: ISignUpDTO.google): Promise<Result<void>> {
    if (token === null || token === '' || token === undefined) return Result.fail<void>('User account not found')

    return Result.ok<void>()
  }
}
