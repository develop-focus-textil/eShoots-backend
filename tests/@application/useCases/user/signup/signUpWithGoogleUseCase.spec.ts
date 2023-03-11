import { SignUnWithGoogle } from '@application/useCases/user/signup/signUpWithGoogleUseCase'

describe('SignUpWithGoogleUseCase', () => {
  it('Should be defined', () => {
    const sut = new SignUnWithGoogle()
    expect(sut).toBeDefined()
  })
})
