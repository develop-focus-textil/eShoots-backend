import { GoogleIDValueObject } from '@domain/user/valueObjects/googleProfile/googleIDValueObject'
import { ErrorMessages } from '@domain/shared/common/errors'
import { UniqueEntityID } from '@domain/shared/core'

describe('Google ID Value Object', () => {
  it('Should create a valid google ID', () => {
    const googleID = GoogleIDValueObject.create(new UniqueEntityID('valid_credentials_google_id'))
    expect(googleID.isSuccess).toBe(true)
  })

  it('Should return fails if not provided google id', () => {
    const googleID = GoogleIDValueObject.create(null as any)
    expect(googleID.isSuccess).toBe(false)
    expect(googleID.isFailure).toBe(true)
    expect(googleID.error).toBe(ErrorMessages.INVALID_CREDENTIALS)
  })
})
