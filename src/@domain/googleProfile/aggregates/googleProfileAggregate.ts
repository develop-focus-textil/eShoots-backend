import { type EmailValueObject } from '@domain/shared/common/valueObjects/emailValueObject'
import { Result, type BaseDomainEntity, type UniqueEntityID } from '@domain/shared/core'
import { AggregateRoot } from '@domain/shared/core/aggregateRoot'

type IGoogleProfileAggregateProps = {
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
export class GoogleProfileAggregate extends AggregateRoot<IGoogleProfileAggregateProps> {
  private constructor (props: IGoogleProfileAggregateProps, id: UniqueEntityID) {
    super(props, id)
  }

  public get name (): string { return this.props.name }
  public get email (): EmailValueObject { return this.props.email }
  public get pictureUrl (): string { return this.props.pictureUrl }
  public get locale (): string { return this.props.locale }

  public static create (props: IGoogleProfileAggregateProps, id: UniqueEntityID): Result<GoogleProfileAggregate> {
    return Result.ok<GoogleProfileAggregate>(new GoogleProfileAggregate(props, id))
  }
}
