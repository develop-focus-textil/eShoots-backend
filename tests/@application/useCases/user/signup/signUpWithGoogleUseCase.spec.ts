import { SignUnWithGoogle } from '@application/useCases/user/signup/signUpWithGoogleUseCase'
import { type IConsoleGoogleAuthContract } from '@domain/contracts/http/consoleGoogle.contract'
import { type IUserRepositoryContract } from '@domain/contracts/repositories/userRepository.contract'
import { UniqueEntityID } from '@domain/shared/core'
import { DateCommonValueObject, EmailValueObject, IpValueObject, PasswordValueObject, TermsValueObject, UserAggregate, type OS } from '@domain/user'
import { GoogleIDValueObject } from '@domain/user/valueObjects/googleProfile/googleIDValueObject'
import { GoogleProfileValueObject } from '@domain/user/valueObjects/googleProfileValueObject'
import { mock, type MockProxy } from 'jest-mock-extended'

export interface IFakerDTO {
  token?: string
  ip?: string
  acceptedTerms?: boolean
  userAgent?: {
    name?: string
    version?: string
    os?: keyof typeof OS
    type?: string
  }
}

describe('SignUpWithGoogleUseCase', () => {
  const fakeDTO = (props?: IFakerDTO) => {
    return {
      acceptedTerms: props?.acceptedTerms ?? true,
      token: props?.token ?? 'valid_token',
      ip: props?.ip ?? '123.123.123.123',
      userAgent: {
        name: props?.userAgent?.name ?? 'Mozilla/5.0',
        os: props?.userAgent?.os ?? 'LINUX',
        type: props?.userAgent?.type ?? 'Browser',
        version: props?.userAgent?.version ?? '29.0.12.1.236'
      }
    }
  }

  const fakeGoogleProfileValueObject = GoogleProfileValueObject.create({
    email: EmailValueObject.create('valid_mail@mail.com').getResult(),
    googleID: GoogleIDValueObject.create(new UniqueEntityID('valid_google_id')).getResult(),
    locale: 'Brazil',
    name: 'John Joe Smith',
    pictureUrl: 'http://console.google.images.com/img/johnjoe.png'
  }).getResult()

  const fakeValueObjectsUser = {
    email: EmailValueObject.create('valid_email@mail.com').getResult(),
    password: PasswordValueObject.create('', true).getResult(),
    terms: [
      TermsValueObject.create({
        acceptedAt: DateCommonValueObject.create(new Date()).getResult(),
        ip: IpValueObject.create('123.123.123.123').getResult(),
        userAgent: {
          name: 'Mozilla/5.0 (Macintosh; Intel Mac OS X',
          os: 'IPHONE',
          type: 'Browser',
          version: '289.789.599'
        }
      }).getResult()
    ],
    googleProfile: fakeGoogleProfileValueObject
  }
  const fakeUserAggregate = UserAggregate.create(fakeValueObjectsUser).getResult()

  let userRepository: MockProxy<IUserRepositoryContract>
  let consoleGoogle: MockProxy<IConsoleGoogleAuthContract>

  let sut: SignUnWithGoogle

  beforeEach(() => {
    userRepository = mock()
    consoleGoogle = mock()
    sut = new SignUnWithGoogle(consoleGoogle, userRepository)
  })

  it('Should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('Should return fails if token is null', async () => {
    const fakeDTOParams = fakeDTO({ token: null as any })
    const result = await sut.run(fakeDTOParams)
    expect(result.isFailure).toBe(true)
    expect(result.isSuccess).toBe(false)
  })

  it('Shoudl return fails if not find user referring to be token', async () => {
    jest.spyOn(consoleGoogle, 'auth').mockResolvedValueOnce(null)
    const fakeDTOParams = fakeDTO()
    const result = await sut.run(fakeDTOParams)
    expect(result.isFailure).toBe(true)
    expect(result.isSuccess).toBe(false)
    expect(result.error).toBe('User account not found')
  })

  describe('Is not exists user', () => {
    it('Should return fails if not accept the terms', async () => {
      jest.spyOn(consoleGoogle, 'auth').mockResolvedValueOnce(fakeGoogleProfileValueObject)
      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false)
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null)

      const fakerDTO = fakeDTO({ acceptedTerms: false })
      const result = await sut.run(fakerDTO)
      expect(result.isFailure).toBe(true)
      expect(result.isSuccess).toBe(false)
      expect(result.error).toBe('Terms should be accepted')
    })

    it('Should save user with success ', async () => {
      jest.spyOn(consoleGoogle, 'auth').mockResolvedValueOnce(fakeGoogleProfileValueObject)
      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false)
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null)
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce()

      const fakerDTO = fakeDTO()
      const result = await sut.run(fakerDTO)
      expect(result.isFailure).toBe(false)
      expect(result.isSuccess).toBe(true)

      expect(userRepository.exist).toHaveBeenCalled()
      expect(userRepository.exist).toHaveBeenCalledTimes(1)

      expect(userRepository.findOne).toHaveBeenCalled()
      expect(userRepository.findOne).toHaveBeenCalledTimes(1)

      expect(consoleGoogle.auth).toHaveBeenCalled()
      expect(consoleGoogle.auth).toHaveBeenCalledTimes(1)

      expect(userRepository.save).toHaveBeenCalled()
      expect(userRepository.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('Is exist user', () => {
    it('Should updated data user with googleID', async () => {
      jest.spyOn(consoleGoogle, 'auth').mockResolvedValueOnce(fakeGoogleProfileValueObject)
      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(true)
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(fakeUserAggregate)

      await sut.run(fakeDTO())

      // Garantir que os dados do usuáro google retornado seja colocado no nosso aggregado
      expect(fakeUserAggregate.googleProfile).toEqual(fakeGoogleProfileValueObject)

      // Garantir que seja chamado os dados para salvar o usuario
      expect(userRepository.findOne).toHaveBeenCalled()
      expect(userRepository.findOne).toHaveBeenCalledTimes(1)
      expect(consoleGoogle.auth).toHaveBeenCalled()
      expect(consoleGoogle.auth).toHaveBeenCalledTimes(1)
      expect(userRepository.updatedGoogleID).toHaveBeenCalled()
      expect(userRepository.updatedGoogleID).toHaveBeenCalledTimes(1)
      expect(userRepository.updatedGoogleID).toHaveBeenCalledWith(fakeUserAggregate.id.toString(), fakeGoogleProfileValueObject.id.toString())
    })
  })
})
