import BaseResponse from "./BaseResponse";
export default class LoginResponse extends BaseResponse {
    statusCode: number;
    ok: number;
    message: string;
    token?: string;
    tokenExpiry?: number;
    refreshToken?: string;
    constructor(statusCode: number, ok: number, message: string, token?: string, tokenExpiry?: number, refreshToken?: string);
    response(): {
        statusCode: number;
        body: string;
        headers: {
            "Set-Cookie": string;
        };
    };
}
