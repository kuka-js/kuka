export default class BaseResponse {
  statusCode: number
  ok: number
  message: string

  constructor(statusCode: number, ok: number, message: string) {
    this.statusCode = statusCode
    this.ok = ok
    this.message = message
  }
}
