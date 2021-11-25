import BaseResponse from "./BaseResponse"
import { headers } from "./headers"

export default class LoginResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  token?: string
  tokenExpiry?: number
  refreshToken?: string

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    token?: string,
    tokenExpiry?: number,
    refreshToken?: string
  ) {
    super(statusCode, ok, message)
    this.token = token
    this.tokenExpiry = tokenExpiry
    this.refreshToken = refreshToken
  }

  response() {
    return {
      statusCode: this.statusCode,
      headers,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message,
            token: this.token,
            tokenExpiry: this.tokenExpiry
          }
        },
        null,
        2
      ),
      headers: {
        "Set-Cookie": "RefreshToken=" + this.refreshToken + ";HttpOnly;"
      }
    }
  }
}
