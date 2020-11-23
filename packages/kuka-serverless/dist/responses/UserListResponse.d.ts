import BaseResponse from "./BaseResponse";
import { UserObject } from "../service/User";
export default class UserListResponse extends BaseResponse {
    statusCode: number;
    ok: number;
    message: string;
    users: UserObject[];
    constructor(statusCode: number, ok: number, message: string, users: UserObject[]);
    response(): {
        statusCode: number;
        body: string;
    };
}
