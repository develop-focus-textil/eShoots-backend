import { SignUnWithGoogle } from '@application/useCases/user/signup/signUpWithGoogleUseCase'
import { type IConsoleGoogleAuthContract } from '@domain/contracts/http/consoleGoogle.contract'
import { type IUserRepositoryContract } from '@domain/contracts/repositories/userRepository.contract'
import { type OS } from '@domain/user'
import { mock, type MockProxy } from 'jest-mock-extended'

export interface IFakerDTO {
  token: string
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
})
