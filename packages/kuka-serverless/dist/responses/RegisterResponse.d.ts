import BaseResponse from "./BaseResponse";
export default class RegisterResponse extends BaseResponse {
    statusCode: number;
    ok: number;
    message: string;
    userId?: string;
    constructor(statusCode: number, ok: number, message: string, userId?: string);
    response(): {
        statusCode: number;
        body: string;
    };
}
