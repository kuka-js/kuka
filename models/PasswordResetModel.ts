export interface PasswordResetModel {
  passwordResetId: string
  email: string
  clicked: boolean
  username?: string
  creationDate?: string
}
