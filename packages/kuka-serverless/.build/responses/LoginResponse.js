"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
var LoginResponse = /** @class */ (function (_super) {
    __extends(LoginResponse, _super);
    function LoginResponse(statusCode, ok, message, token, tokenExpiry, refreshToken) {
        var _this = _super.call(this, statusCode, ok, message) || this;
        _this.token = token;
        _this.tokenExpiry = tokenExpiry;
        _this.refreshToken = refreshToken;
        return _this;
    }
    LoginResponse.prototype.response = function () {
        return {
            statusCode: this.statusCode,
            body: JSON.stringify({
                ok: this.ok,
                data: {
                    message: this.message,
                    token: this.token,
                    tokenExpiry: this.tokenExpiry
                }
            }, null, 2),
            headers: {
                "Set-Cookie": "RefreshToken=" + this.refreshToken + ";HttpOnly;"
            }
        };
    };
    return LoginResponse;
}(BaseResponse_1.default));
exports.default = LoginResponse;
