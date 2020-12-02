import BaseResponse from "./BaseResponse";
export default class ScopeResponse extends BaseResponse {
    statusCode: number;
    ok: number;
    message: string;
    scopes: string[];
    constructor(statusCode: number, ok: number, message: string, scopes: string[]);
    response(): {
        statusCode: number;
        body: string;
    };
}
