import { type OS } from '@domain/user'

export interface ISignUpDTO {
  system?: ISignUpDTO.system
  google?: ISignUpDTO.google
  facebook?: ISignUpDTO.facebook
}

export namespace ISignUpDTO {
  export type system = {
    email: string
    password: string
    ip: string
    acceptedTerms: boolean
    userAgent: {
      name: string
      version: string
      os: keyof typeof OS
      type: string
    }
  }
  export type google = {
    token: string
    ip: string
    acceptedTerms: boolean
    userAgent: {
      name: string
      version: string
      os: keyof typeof OS
      type: string
    }
  }
  export type facebook = {
    token: string
    ip: string
    acceptedTerms: boolean
    userAgent: {
      name: string
      version: string
      os: keyof typeof OS
      type: string
    }
  }
}
