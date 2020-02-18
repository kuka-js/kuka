import BaseResponse from "./BaseResponse"
import {getUserListResponse} from "../service/User"

export default class UserListResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  users: getUserListResponse[]

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    users: getUserListResponse[]
  ) {
    super(statusCode, ok, message)
    this.users = users
  }

  response() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(
        {
          ok: this.ok,
          data: {
            message: this.message,
            users: this.users
          }
        },
        null,
        2
      )
    }
  }
}
