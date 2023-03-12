import { ErrorMessages } from '@domain/shared/common/errors'
import { Entity, Result, type UniqueEntityID } from '@domain/shared/core'

export class GoogleIDValueObject extends Entity<any> {
  private constructor (id: UniqueEntityID) {
    super(null, id)
  }

  public get id (): UniqueEntityID { return this._id }

  public static create (id: UniqueEntityID): Result<GoogleIDValueObject> {
    if (!id) {
      return Result.fail<GoogleIDValueObject>(ErrorMessages.INVALID_CREDENTIALS)
    }
    return Result.ok<GoogleIDValueObject>(new GoogleIDValueObject(id))
  }
}
