export default class BaseResponse {
    statusCode: number;
    ok: number;
    message: string;
    constructor(statusCode: number, ok: number, message: string);
    response(): {
        statusCode: number;
        body: string;
    };
}
