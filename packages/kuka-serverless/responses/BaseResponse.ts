import { headers } from "./headers"
export default class BaseResponse {
  statusCode: number
  ok: number
  message: string

  constructor(statusCode: number, ok: number, message: string) {
    this.statusCode = statusCode
    this.ok = ok
    this.message = message
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
          },
        },
        null,
        2
      ),
    }
  }
}
