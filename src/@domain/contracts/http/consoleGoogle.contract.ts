import { type GoogleProfileValueObject } from '@domain/user/valueObjects/googleProfileValueObject'

/**
 * @Returns GoogleProfileValueObject
 */
export interface IConsoleGoogleAuthContract {
  auth: (token: string) => Promise<GoogleProfileValueObject | null>
}
