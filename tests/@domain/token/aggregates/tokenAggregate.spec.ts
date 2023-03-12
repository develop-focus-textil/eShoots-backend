/* eslint-disable @typescript-eslint/no-unused-expressions */
import { TokenUserAggregate } from '@domain/token/aggregates/tokenUserAggregate'
import { TokenEncryptedValueObject } from '@domain/token/valueObjects/TokenEncryptedValueObject'

const isDateNow = new Date()

describe('UserTokenAggregate', () => {
  it('Should create success if provided fields', () => {
    const myID = 'valid_id'
    const generationtoken = TokenEncryptedValueObject.encrypt(myID)

    const sut = TokenUserAggregate.create({
      device: 'macOS - Browser in Mozzila',
      token: generationtoken.getResult(),
      createdAt: isDateNow
    })

    expect(sut.isSuccess).toBe(true)
    expect(sut.isFailure).toBe(false)

    expect(sut.getResult().isExperies).toBe(false)
    expect(sut.getResult().experieIn).toBe(new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'full'
    }).format(new Date(new Date().setDate(new Date().getDate() + 90)))
    )
    expect(sut.getResult().token.value).toBe(generationtoken.getResult().value)
  })
})
