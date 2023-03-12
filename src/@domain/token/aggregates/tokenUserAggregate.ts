/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type BaseDomainEntity, Result, type UniqueEntityID } from '@domain/shared/core'
import { AggregateRoot } from '@domain/shared/core/aggregateRoot'

import { type TokenEncryptedValueObject } from '../valueObjects/TokenEncryptedValueObject'

type IUserTokenAggregateProps = {
  token: TokenEncryptedValueObject
  device: string
  createdAt: Date
} & BaseDomainEntity

export class TokenUserAggregate extends AggregateRoot<IUserTokenAggregateProps> {
  static #experienIn: number = 90 // expira em 90 dias

  private constructor (props: IUserTokenAggregateProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public get token (): TokenEncryptedValueObject { return this.props.token }
  public get devide (): string { return this.props.device }

  public get isExperies (): boolean {
    const calculatedDate = new Date()
    const valitedDate = calculatedDate.setDate(calculatedDate.getDate() + TokenUserAggregate.#experienIn)
    return this.createdAt > new Date(valitedDate)
  }

  public get experieIn (): string {
    const dateExperie = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'full'
    }).format(new Date(this.createdAt.setDate(this.createdAt.getDate() + TokenUserAggregate.#experienIn)))
    return dateExperie
  }

  public static create (props: IUserTokenAggregateProps, id?: UniqueEntityID): Result<TokenUserAggregate> {
    return Result.ok<TokenUserAggregate>(new TokenUserAggregate(props, id))
  }
}
