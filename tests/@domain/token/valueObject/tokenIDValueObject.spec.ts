import { UniqueEntityID } from '@domain/shared/core'
import { TokenIDValueObject } from '@domain/token/valueObjects/tokenIDValueObject'

describe('TokenIdValueObject', () => {
  it('Should create a valid userId', () => {
    const userId = TokenIDValueObject.create()
    expect(userId.isSuccess).toBe(true)
  })

  it('Should create a valid userId with value', () => {
    const userId = TokenIDValueObject.create(new UniqueEntityID('valid_id'))
    expect(userId.isSuccess).toBe(true)
    expect(userId.getResult().id.toValue()).toEqual('valid_id')
  })
})
