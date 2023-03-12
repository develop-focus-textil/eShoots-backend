/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Result } from '../../shared/core/result'
import { UniqueEntityID, ValueObject } from '@domain/shared/core'
import { sign, verify } from 'jsonwebtoken'
import { UserIdValueObject } from '@domain/user'
import { ErrorMessages } from '@domain/shared/common/errors'

type ITokenValueObject = {
  token: string
  userID?: string
}

export class TokenEncryptedValueObject extends ValueObject<ITokenValueObject> {
  static #secret: string = 'VALID_VALUE_TOKEN'

  private constructor (props: ITokenValueObject) {
    super(props)
  }

  public get value (): string { return this.props.token }

  public get decrypt (): UserIdValueObject {
    const idValue = verify(this.props.token, TokenEncryptedValueObject.#secret) as { id: string }
    return UserIdValueObject.create(new UniqueEntityID(idValue.id)).getResult()
  }

  private static validatedToken (token: string): string | null {
    try {
      return verify(token, TokenEncryptedValueObject.#secret) as string
    } catch {
      return null
    }
  }

  public static create (props: ITokenValueObject, userID?: string): Result<TokenEncryptedValueObject> {
    if (!userID) {
      const validatedToken = TokenEncryptedValueObject.validatedToken(props.token)
      if (!validatedToken) {
        return Result.fail<TokenEncryptedValueObject>(ErrorMessages.INVALID_CREDENTIALS)
      } else {
        return Result.ok<TokenEncryptedValueObject>(new TokenEncryptedValueObject({ token: props.token, userID: validatedToken }))
      }
    }

    return Result.ok<TokenEncryptedValueObject>(new TokenEncryptedValueObject({ token: props.token, userID }))
  }

  public static encrypt (userID: string): Result<TokenEncryptedValueObject> {
    const token = sign({ id: userID }, TokenEncryptedValueObject.#secret)
    return TokenEncryptedValueObject.create({ token, userID })
  }
}
