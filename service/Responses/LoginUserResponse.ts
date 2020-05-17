export interface LoginUserResponse {
  ok: number
  data: {
    error?: string
    username?: string
    message: string
    refreshToken?: string
    token?: string
    expiry?: number
  }
}
