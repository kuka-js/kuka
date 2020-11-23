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
exports.lockUser = exports.deleteUser = exports.refreshToken = exports.getUser = exports.getUserList = exports.getScopes = exports.removeScope = exports.addScope = exports.password = exports.reset = exports.verify = exports.login = exports.register = void 0;
var core_1 = require("@kuka/core");
var RegisterResponse_1 = require("./responses/RegisterResponse");
var LoginResponse_1 = require("./responses/LoginResponse");
var BaseResponse_1 = require("./responses/BaseResponse");
var ResetResponse_1 = require("./responses/ResetResponse");
var ScopeResponse_1 = require("./responses/ScopeResponse");
var UserListResponse_1 = require("./responses/UserListResponse");
var BaseErrorResponse_1 = require("./responses/BaseErrorResponse");
var UserResponse_1 = require("./responses/UserResponse");
var logg = require("loglevel");
var log = logg.getLogger("handler");
log.setLevel("debug");
exports.register = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password_1, userService, _b, ok, data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(event.body != null)) return [3 /*break*/, 2];
                try {
                    JSON.parse(event.body);
                }
                catch (e) {
                    return [2 /*return*/, new RegisterResponse_1.default(500, 0, "JSON invalid").response()];
                }
                _a = JSON.parse(event.body), username = _a.username, email = _a.email, password_1 = _a.password;
                userService = new core_1.UserService();
                return [4 /*yield*/, userService.registerUser(username, email, password_1)];
            case 1:
                _b = _c.sent(), ok = _b.ok, data = _b.data;
                if (ok == 0) {
                    return [2 /*return*/, new RegisterResponse_1.default(500, 0, data.message).response()];
                }
                else {
                    return [2 /*return*/, new RegisterResponse_1.default(201, 1, data.message, data.userId).response()];
                }
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, new RegisterResponse_1.default(400, 0, "No body sent").response()];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.login = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password_2, userService, _b, ok, data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(event.body != null)) return [3 /*break*/, 2];
                _a = JSON.parse(event.body), username = _a.username, password_2 = _a.password;
                userService = new core_1.UserService();
                return [4 /*yield*/, userService.loginUser(username, password_2)];
            case 1:
                _b = _c.sent(), ok = _b.ok, data = _b.data;
                if (ok == 0) {
                    return [2 /*return*/, new LoginResponse_1.default(400, 0, data.message).response()];
                }
                else {
                    return [2 /*return*/, new LoginResponse_1.default(200, 1, data.message, data.token, data.expiry, data.refreshToken).response()];
                }
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, new LoginResponse_1.default(400, 0, "No body sent").response()];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verify = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var id, verification, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = event.pathParameters.id;
                verification = new core_1.VerificationService();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, verification.markEmailVerified(id)];
            case 2:
                _a.sent();
                return [2 /*return*/, new BaseResponse_1.default(200, 1, "Email verified").response()];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, new BaseResponse_1.default(500, 0, "Unable to verify email").response()];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.reset = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var email, passwordReset, passwordResetResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(event.body != null)) return [3 /*break*/, 2];
                email = JSON.parse(event.body).email;
                passwordReset = new core_1.PasswordResetService();
                return [4 /*yield*/, passwordReset.createPasswordResetLink(email)];
            case 1:
                passwordResetResult = _a.sent();
                if (passwordResetResult == "true") {
                    return [2 /*return*/, new BaseResponse_1.default(200, 1, "Password Reset email sent").response()];
                }
                else if (passwordResetResult == "false") {
                    return [2 /*return*/, new BaseResponse_1.default(500, 0, "Unable to send password reset email").response()];
                }
                else {
                    // If passwordResetResult return resetId
                    return [2 /*return*/, new ResetResponse_1.default(200, 1, "Returning resetId", passwordResetResult).response()];
                }
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.password = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, passwordResetId, password1, password2, user, changePasswordResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(event.body != null)) return [3 /*break*/, 2];
                _a = JSON.parse(event.body), passwordResetId = _a.passwordResetId, password1 = _a.password1, password2 = _a.password2;
                user = new core_1.UserService();
                return [4 /*yield*/, user.changePassword(passwordResetId, password1, password2)];
            case 1:
                changePasswordResult = _b.sent();
                if (changePasswordResult.ok == 0) {
                    return [2 /*return*/, new BaseResponse_1.default(500, 0, changePasswordResult.data.message).response()];
                }
                return [2 /*return*/, new BaseResponse_1.default(200, 1, "Password reset succesfully").response()];
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.addScope = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, username, newScope, scopes, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(event.body != null)) return [3 /*break*/, 4];
                body = JSON.parse(event.body);
                username = body.username;
                newScope = body.scope;
                scopes = new core_1.ScopeService();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, scopes.addScope(username, newScope)];
            case 2:
                _a.sent();
                return [2 /*return*/, new BaseResponse_1.default(200, 1, "Scope added succesfully").response()];
            case 3:
                e_2 = _a.sent();
                return [2 /*return*/, new BaseResponse_1.default(500, 0, "Failed to add scope").response()];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.removeScope = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var username, scopeName, scopes, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log.debug(event);
                username = event.headers["X-Custom-Username"];
                if (!username) {
                    return [2 /*return*/, new BaseResponse_1.default(400, 0, "Give username in headers").response()];
                }
                log.debug("Username: " + username);
                scopeName = event.pathParameters.scopeName;
                scopes = new core_1.ScopeService();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, scopes.removeScope(username, scopeName)];
            case 2:
                _a.sent();
                return [2 /*return*/, new BaseResponse_1.default(200, 1, "Scope removed succesfully").response()];
            case 3:
                e_3 = _a.sent();
                log.debug(e_3);
                return [2 /*return*/, new BaseResponse_1.default(500, 0, "Failed to remove scope").response()];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getScopes = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var username, scopes, scopeResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log.debug("handler getScopes");
                log.debug(event);
                username = event.headers["X-Custom-Username"];
                //  const username = event.requestContext.authorizer.principalId
                log.debug("Username:");
                log.debug(username);
                if (!username) return [3 /*break*/, 2];
                scopes = new core_1.ScopeService();
                return [4 /*yield*/, scopes.getScopes(username)];
            case 1:
                scopeResponse = _a.sent();
                if (Array.isArray(scopeResponse)) {
                    return [2 /*return*/, new ScopeResponse_1.default(200, 1, "Your scopes", scopeResponse).response()];
                }
                else {
                    return [2 /*return*/, new BaseResponse_1.default(500, 0, "Something went wrong").response()];
                }
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, new BaseResponse_1.default(400, 0, "Give username").response()];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserList = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var users, userResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                users = new core_1.UserService();
                return [4 /*yield*/, users.getUserList()];
            case 1:
                userResponse = _a.sent();
                if (Array.isArray(userResponse)) {
                    return [2 /*return*/, new UserListResponse_1.default(200, 1, "The userlist", userResponse).response()];
                }
                else {
                    return [2 /*return*/, new BaseResponse_1.default(500, 0, "Connection error").response()];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getUser = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var username, userService, userResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = event.headers["X-Custom-Username"];
                userService = new core_1.UserService();
                return [4 /*yield*/, userService.getUser(username)];
            case 1:
                userResponse = _a.sent();
                if (userResponse != null) {
                    return [2 /*return*/, new UserResponse_1.default(200, 1, "User data for " + username, userResponse).response()];
                }
                else {
                    return [2 /*return*/, new BaseErrorResponse_1.default("Could not find user").response()];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var username, cookie, RefreshToken, tokenResponse, renewJWTResponse, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = event.headers["X-Custom-Username"];
                cookie = core_1.RefreshTokenService.getCookiesFromHeader(event.headers);
                RefreshToken = cookie.RefreshToken;
                return [4 /*yield*/, core_1.RefreshTokenService.refreshToken(username, RefreshToken)];
            case 1:
                tokenResponse = _a.sent();
                if (!(tokenResponse.ok == 1)) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, core_1.UserService.renewJWTToken(username)];
            case 3:
                renewJWTResponse = _a.sent();
                return [2 /*return*/, new LoginResponse_1.default(200, 1, "JWT renewed succesfully", renewJWTResponse.token, renewJWTResponse.expiry, tokenResponse.refreshToken).response()];
            case 4:
                e_4 = _a.sent();
                return [2 /*return*/, new BaseErrorResponse_1.default("Could not renew refresh token").response()];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, new BaseErrorResponse_1.default("Could not renew refresh token").response()];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, userResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = event.headers["X-Custom-Username"];
                user = new core_1.UserService();
                return [4 /*yield*/, user.deleteUser(username)];
            case 1:
                userResponse = _a.sent();
                if (userResponse) {
                    return [2 /*return*/, new BaseResponse_1.default(200, 1, "Removed user: " + username).response()];
                }
                else {
                    return [2 /*return*/, new BaseResponse_1.default(500, 0, "Something went wrong").response()];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.lockUser = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var username, lockedBy, reason, body, user, lockResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = event.headers["X-Custom-Username"];
                lockedBy = event.requestContext.authorizer.principalId;
                if (event.body != null) {
                    body = JSON.parse(event.body);
                    reason = body.reason;
                }
                user = new core_1.UserService();
                return [4 /*yield*/, user.lockUser(username, lockedBy, reason)];
            case 1:
                lockResponse = _a.sent();
                if (lockResponse) {
                    return [2 /*return*/, new BaseResponse_1.default(200, 1, "User " + username + " locked ").response()];
                }
                else {
                    return [2 /*return*/, new BaseResponse_1.default(500, 0, "Failed to lock user").response()];
                }
                return [2 /*return*/];
        }
    });
}); };
