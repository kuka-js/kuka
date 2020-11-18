import {UserModel} from "../../models/UserModel"

export interface CreateUserResponse extends BaseDBResponse {}
export interface UpdateUserResponse extends BaseDBResponse {}
export interface DeleteUserResponse extends BaseDBResponse {}
export interface GetUserResponse extends BaseDBResponse {
  data: {
    message: string
    error?: string
    user?: UserModel
  }
}
interface BaseDBResponse {
  ok: number
  data: {
    message: string
    error?: string
  }
}
