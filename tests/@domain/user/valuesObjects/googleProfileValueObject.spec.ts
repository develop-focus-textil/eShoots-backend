import { GoogleIDValueObject } from '@domain/user/valueObjects/googleProfile/googleIDValueObject'
import { EmailValueObject } from '@domain/shared/common/valueObjects/emailValueObject'
import { UniqueEntityID } from '@domain/shared/core'
import { GoogleProfileValueObject } from '@domain/user/valueObjects/googleProfileValueObject'

describe('GoogleProfileValueObject', () => {
  it('Should Create a Valid Google Profile', () => {
    const googleProfileValueObject = GoogleProfileValueObject.create({
      email: EmailValueObject.create('valid_google_profile_email@gmail.com').getResult(),
      locale: 'Brazil',
      pictureUrl: 'google.auth.googleusercontent.com/image/christian.jpg',
      name: 'John Joe Smith',
      googleID: GoogleIDValueObject.create(new UniqueEntityID('valid_google_profile_id')).getResult()
    })

    expect(googleProfileValueObject.isSuccess).toBe(true)
    expect(googleProfileValueObject.isFailure).toBe(false)
  })

  it('Should get valid values', () => {
    const googleProfileValueObject = GoogleProfileValueObject.create({
      email: EmailValueObject.create('valid_google_profile_email@gmail.com').getResult(),
      locale: 'Brazil',
      pictureUrl: 'google.auth.googleusercontent.com/image/christian.jpg',
      name: 'John Joe Smith',
      googleID: GoogleIDValueObject.create(new UniqueEntityID('valid_google_profile_id')).getResult()
    })

    const googleProfile = googleProfileValueObject.getResult()
    expect(googleProfile.id.toValue()).toBe('valid_google_profile_id')
    expect(googleProfile.name).toBe('John Joe Smith')
    expect(googleProfile.pictureUrl).toBe('google.auth.googleusercontent.com/image/christian.jpg')
    expect(googleProfile.locale).toBe('Brazil')
    expect(googleProfile.email.value).toBe('valid_google_profile_email@gmail.com')
  })
})
