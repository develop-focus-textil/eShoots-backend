import { type EmailValueObject } from '@domain/shared/common/valueObjects/emailValueObject'
import { Result, type BaseDomainEntity, type UniqueEntityID, ValueObject } from '@domain/shared/core'
import { type GoogleIDValueObject } from './googleProfile/googleIDValueObject'

type IGoogleProfileValueObject = {
  googleID: GoogleIDValueObject
  email: EmailValueObject
  locale: string
  pictureUrl: string
  name: string
} & BaseDomainEntity

/**
 * @var id 'UniqueEntityID'
 * @var email 'PasswordValueObject'
 * @var locale String
 * @var pictureUrl String
 * @var name String
 */
export class GoogleProfileValueObject extends ValueObject<IGoogleProfileValueObject> {
  private constructor (props: IGoogleProfileValueObject) {
    super(props)
  }

  public get name (): string { return this.props.name }
  public get email (): EmailValueObject { return this.props.email }
  public get pictureUrl (): string { return this.props.pictureUrl }
  public get locale (): string { return this.props.locale }
  public get id (): UniqueEntityID { return this.props.googleID.id }

  public static create (props: IGoogleProfileValueObject): Result<GoogleProfileValueObject> {
    return Result.ok<GoogleProfileValueObject>(new GoogleProfileValueObject(props))
  }
}
