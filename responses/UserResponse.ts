import BaseResponse from "./BaseResponse"
import {GetUserApiResponse} from "../service/User"

export default class UserResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  user: GetUserApiResponse

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    user: GetUserApiResponse
  ) {
    super(statusCode, ok, message)
    this.user = user
  }

  response() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message,
            users: this.user
          }
        },
        null,
        2
      )
    }
  }
}
