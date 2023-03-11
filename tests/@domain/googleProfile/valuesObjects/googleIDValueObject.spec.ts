import { GoogleIDValueObject } from '@domain/googleProfile/valueObjects/googleIDValueObject'
import { ErrorMessages } from '@domain/shared/common/errors'
import { UniqueEntityID } from '@domain/shared/core'

describe('Google ID Value Object', () => {
  it('Should create a valid google ID', () => {
    const googleID = GoogleIDValueObject.create(new UniqueEntityID('valid_credentials_google_id'))
    expect(googleID.isSuccess).toBe(true)
  })
})
