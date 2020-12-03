"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseResponse = /** @class */ (function () {
    function BaseResponse(statusCode, ok, message) {
        this.statusCode = statusCode;
        this.ok = ok;
        this.message = message;
    }
    BaseResponse.prototype.response = function () {
        return {
            statusCode: this.statusCode,
            body: JSON.stringify({
                ok: this.ok,
                data: {
                    message: this.message
                }
            }, null, 2)
        };
    };
    return BaseResponse;
}());
exports.default = BaseResponse;
