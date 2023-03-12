import { type OS } from '@domain/user'
import { type UserAggregate } from '@domain/user/aggregates/userAggregate'

export interface IGenerationTokenDTO {
  user: UserAggregate
  userAgent: {
    name: string
    version: string
    os: keyof typeof OS
    type: string
  }
}

export interface ResponseToken {
  token: string
}
