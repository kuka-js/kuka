import BaseResponse from "./BaseResponse"
import {UserObject} from "../service/User"

export default class UserListResponse extends BaseResponse {
  statusCode: number
  ok: number
  message: string
  users: UserObject[]

  constructor(
    statusCode: number,
    ok: number,
    message: string,
    users: UserObject[]
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
