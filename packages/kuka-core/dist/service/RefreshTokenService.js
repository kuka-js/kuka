"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenServiceError = void 0;
var uuid_1 = require("uuid");
var DatabaseFactory_1 = require("./Database/DatabaseFactory");
var RefreshTokenService = /** @class */ (function () {
    function RefreshTokenService() {
    }
    RefreshTokenService.refreshToken = function (username, oldRefreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, refreshToken, newRefreshToken, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, DBImpl.getRefreshToken(username)];
                    case 2:
                        refreshToken = _a.sent();
                        if (!this.compareRefreshTokens(oldRefreshToken, refreshToken)) return [3 /*break*/, 4];
                        newRefreshToken = this.generateRefreshToken();
                        return [4 /*yield*/, DBImpl.updateRefreshToken(username, newRefreshToken)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { ok: 1, refreshToken: newRefreshToken }];
                    case 4: return [2 /*return*/, {
                            ok: 0,
                            errorCode: RefreshTokenServiceError.REFRESH_TOKEN_INVALID,
                            errorMessage: "Given refresh token does not match",
                        }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, {
                                ok: 0,
                                errorCode: RefreshTokenServiceError.CONNECTION_PROBLEM,
                                errorMessage: "Connection problem",
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RefreshTokenService.compareRefreshTokens = function (oldRefreshToken, newRefreshToken) {
        if (oldRefreshToken == newRefreshToken) {
            return true;
        }
        else {
            return false;
        }
    };
    RefreshTokenService.generateRefreshToken = function () {
        return uuid_1.v4();
    };
    RefreshTokenService.getCookiesFromHeader = function (headers) {
        if (headers === null ||
            headers === undefined ||
            headers.Cookie === undefined) {
            return {};
        }
        // Split a cookie string in an array (Originally found http://stackoverflow.com/a/3409200/1427439)
        var list = {}, rc = headers.Cookie;
        rc &&
            rc.split(";").forEach(function (cookie) {
                var parts = cookie.split("=");
                var key = parts.shift().trim();
                var value = decodeURI(parts.join("="));
                if (key != "") {
                    list[key] = value;
                }
            });
        return list;
    };
    return RefreshTokenService;
}());
exports.default = RefreshTokenService;
var RefreshTokenServiceError;
(function (RefreshTokenServiceError) {
    RefreshTokenServiceError[RefreshTokenServiceError["CONNECTION_PROBLEM"] = 0] = "CONNECTION_PROBLEM";
    RefreshTokenServiceError[RefreshTokenServiceError["REFRESH_TOKEN_INVALID"] = 1] = "REFRESH_TOKEN_INVALID";
})(RefreshTokenServiceError = exports.RefreshTokenServiceError || (exports.RefreshTokenServiceError = {}));
