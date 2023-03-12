import { sign } from 'jsonwebtoken'
import { TokenEncryptedValueObject } from '@domain/token/valueObjects/TokenEncryptedValueObject'
import { ErrorMessages } from '@domain/shared/common/errors'

describe('TokenEncryptedValueObject', () => {
  const userID = 'valid_user_id'

  it('Should return encrypted token if provided userID', () => {
    const sut = TokenEncryptedValueObject.encrypt(userID)
    expect(sut.isFailure).toBe(false)
    expect(sut.isSuccess).toBe(true)

    expect(sut.getResult().decrypt.id.toValue()).toBe('valid_user_id')
  })

  it('Should return encrypted token if provided userID', () => {
    const fakeToken = sign({ id: userID }, 'VALID_VALUE_TOKEN')

    const sut = TokenEncryptedValueObject.create({ token: fakeToken })
    expect(sut.isFailure).toBe(false)
    expect(sut.isSuccess).toBe(true)
    expect(sut.getResult().decrypt.id.toValue()).toBe('valid_user_id')
  })

  it('Should return fail if token is invalid', () => {
    const sut = TokenEncryptedValueObject.create({ token: 'invalid_token' })
    expect(sut.isFailure).toBe(true)
    expect(sut.isSuccess).toBe(false)
    expect(sut.error).toBe(ErrorMessages.INVALID_CREDENTIALS)
  })
})
