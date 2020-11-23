"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseResponse_1 = require("./BaseResponse");
var ResetResponse = /** @class */ (function (_super) {
    __extends(ResetResponse, _super);
    function ResetResponse(statusCode, ok, message, resetId) {
        var _this = _super.call(this, statusCode, ok, message) || this;
        _this.resetId = resetId;
        return _this;
    }
    ResetResponse.prototype.response = function () {
        return {
            statusCode: this.statusCode,
            body: JSON.stringify({
                ok: this.ok,
                data: {
                    message: this.message,
                    resetId: this.resetId
                }
            }, null, 2)
        };
    };
    return ResetResponse;
}(BaseResponse_1.default));
exports.default = ResetResponse;
