import BaseResponse from "./BaseResponse";
export default class ResetResponse extends BaseResponse {
    statusCode: number;
    ok: number;
    message: string;
    resetId?: string;
    constructor(statusCode: number, ok: number, message: string, resetId?: string);
    response(): {
        statusCode: number;
        body: string;
    };
}
