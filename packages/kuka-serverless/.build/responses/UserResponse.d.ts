import BaseResponse from "./BaseResponse";
import { UserObject } from "../service/User";
export default class UserResponse extends BaseResponse {
    statusCode: number;
    ok: number;
    message: string;
    user: UserObject;
    constructor(statusCode: number, ok: number, message: string, user: UserObject);
    response(): {
        statusCode: number;
        body: string;
    };
}
