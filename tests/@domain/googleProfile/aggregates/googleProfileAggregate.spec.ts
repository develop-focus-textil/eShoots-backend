import { GoogleProfileAggregate } from '@domain/googleProfile/aggregates/googleProfileAggregate'
import { GoogleIDValueObject } from '@domain/googleProfile/valueObjects/googleIDValueObject'
import { EmailValueObject } from '@domain/shared/common/valueObjects/emailValueObject'
import { UniqueEntityID } from '@domain/shared/core'

describe('GoogleProfileAggregate', () => {
  it('Should Create a Valid Google Profile', () => {
    const googleProfileAggregate = GoogleProfileAggregate.create({
      email: EmailValueObject.create('valid_google_profile_email@gmail.com').getResult(),
      locale: 'Brazil',
      pictureUrl: 'google.auth.googleusercontent.com/image/christian.jpg',
      name: 'John Joe Smith'
    }, GoogleIDValueObject.create(new UniqueEntityID('valid_google_profile_id')).getResult().id)

    expect(googleProfileAggregate.isSuccess).toBe(true)
    expect(googleProfileAggregate.isFailure).toBe(false)
  })
})
