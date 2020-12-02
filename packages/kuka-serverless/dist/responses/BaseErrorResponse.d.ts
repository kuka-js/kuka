import BaseResponse from "./BaseResponse";
export default class BaseErrorResponse extends BaseResponse {
    statusCode: number;
    ok: number;
    message: string;
    constructor(message: string);
    response(): {
        statusCode: number;
        body: string;
    };
}
