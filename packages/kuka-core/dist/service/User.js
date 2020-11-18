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
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var RefreshTokenService_1 = require("./RefreshTokenService");
var uuid_1 = require("uuid");
var DatabaseFactory_1 = require("./Database/DatabaseFactory");
var DBConncetionException_1 = require("../exceptions/DBConncetionException");
var UserDoesNotExistException_1 = require("../exceptions/UserDoesNotExistException");
var Verification_1 = require("./Verification");
var logg = require("loglevel");
var log = logg.getLogger("User");
log.setLevel("debug");
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.prototype.changePassword = function (passwordResetId, password1, password2) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, passwordResetModel, createdDate, now, diffTime, diffDays, username, passwordHash, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.passwordStrengthCheck(password1)) {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: {
                                        error: "Password is too weak",
                                        message: "Password is too weak",
                                    },
                                }];
                        }
                        if (password1 != password2) {
                            return [2 /*return*/, { ok: 0, data: { message: "Passwords do not match!" } }];
                        }
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, DBImpl.getPasswordReset(passwordResetId)];
                    case 2:
                        passwordResetModel = _a.sent();
                        createdDate = new Date(passwordResetModel.creationDate);
                        now = new Date();
                        diffTime = Math.abs(createdDate.getTime() - now.getTime());
                        diffDays = diffTime / (1000 * 60 * 60 * 24);
                        if (diffDays > 1) {
                            return [2 /*return*/, { ok: 0, data: { message: "Password reset link expired" } }];
                        }
                        username = passwordResetModel.username;
                        passwordHash = bcrypt_1.hashSync(password1, 10);
                        return [4 /*yield*/, DBImpl.updatePasswordHash(username, passwordHash)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { ok: 1, data: { message: "Password successfully changed" } }];
                    case 4:
                        e_1 = _a.sent();
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.registerUser = function (username, email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordHash, userId, emailVerified, userModel, DBImpl, existsBool, createUserResponse, createUserAPIResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.passwordStrengthCheck(password)) {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: {
                                        error: "Password is too weak",
                                        username: username,
                                        message: "Password is too weak",
                                    },
                                }];
                        }
                        passwordHash = bcrypt_1.hashSync(password, 10);
                        userId = uuid_1.v4();
                        if (process.env.AUTO_VERIFY_MAIL) {
                            emailVerified = true;
                        }
                        else {
                            emailVerified = false;
                        }
                        userModel = {
                            passwordHash: passwordHash,
                            username: username,
                            email: email,
                            emailVerified: emailVerified,
                            userId: userId,
                            scopes: ["default", "root"],
                        };
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        return [4 /*yield*/, DBImpl.userExists(username)];
                    case 1:
                        existsBool = _a.sent();
                        if (existsBool) {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: {
                                        username: username,
                                        message: "Username taken",
                                    },
                                }];
                        }
                        return [4 /*yield*/, DBImpl.createUser(userModel)];
                    case 2:
                        createUserResponse = _a.sent();
                        return [4 /*yield*/, Verification_1.default.createVerificationLink({
                                email: email,
                                username: username,
                            })];
                    case 3:
                        _a.sent();
                        createUserAPIResponse = {
                            ok: createUserResponse.ok,
                            data: {
                                userId: userId,
                                username: username,
                                error: createUserResponse.data.error,
                                message: createUserResponse.data.message,
                            },
                        };
                        return [2 /*return*/, createUserAPIResponse];
                }
            });
        });
    };
    UserService.prototype.loginUser = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, user, token, exp, refreshTokenString, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, DBImpl.getUser(username)];
                    case 2:
                        user = _a.sent();
                        if (!user.emailVerified) {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: {
                                        error: "Email not verified.",
                                        username: username,
                                        message: "Email not verified.",
                                    },
                                }];
                        }
                        if (user.lockId) {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: {
                                        error: "User is locked.",
                                        username: username,
                                        message: "User is locked.",
                                    },
                                }];
                        }
                        if (bcrypt_1.compareSync(password, user.passwordHash)) {
                            token = jsonwebtoken_1.sign({
                                username: username,
                                scopes: user.scopes,
                            }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRATION_TIME });
                            exp = jsonwebtoken_1.decode(token).exp;
                            refreshTokenString = RefreshTokenService_1.default.generateRefreshToken();
                            DBImpl.updateRefreshToken(username, refreshTokenString);
                            return [2 /*return*/, {
                                    ok: 1,
                                    data: {
                                        username: username,
                                        message: "Login successful.",
                                        refreshToken: refreshTokenString,
                                        token: token,
                                        expiry: exp,
                                    },
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: {
                                        error: "Login failed.",
                                        username: username,
                                        message: "Login failed.",
                                    },
                                }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        if (e_2 instanceof DBConncetionException_1.DBConnectionException) {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: {
                                        message: "DB connection error",
                                        error: "DB connection error",
                                    },
                                }];
                        }
                        else if (e_2 instanceof UserDoesNotExistException_1.UserDoesNotExistException) {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: { message: "User not found", error: "User not found" },
                                }];
                        }
                        else if (e_2 instanceof Error) {
                            throw e_2;
                        }
                        else {
                            throw e_2;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.renewJWTToken = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, scopes, token, exp, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, DBImpl.getScopes(username)];
                    case 2:
                        scopes = _a.sent();
                        token = jsonwebtoken_1.sign({
                            username: username,
                            scopes: scopes,
                        }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRATION_TIME });
                        exp = jsonwebtoken_1.decode(token).exp;
                        return [2 /*return*/, {
                                username: username,
                                message: "JWT renewed succesfully.",
                                token: token,
                                expiry: exp,
                            }];
                    case 3:
                        e_3 = _a.sent();
                        throw new Error();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.emailToUsername = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, username, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        return [4 /*yield*/, DBImpl.emailToUsername(email)];
                    case 1:
                        username = _a.sent();
                        return [2 /*return*/, username];
                    case 2:
                        e_4 = _a.sent();
                        throw e_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUserList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, userList, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        return [4 /*yield*/, DBImpl.getUserList()];
                    case 1:
                        userList = _a.sent();
                        return [2 /*return*/, userList];
                    case 2:
                        e_5 = _a.sent();
                        throw e_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, user, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        return [4 /*yield*/, DBImpl.getUser(username)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                    case 2:
                        e_6 = _a.sent();
                        throw e_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.deleteUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        return [4 /*yield*/, DBImpl.deleteUser(username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_7 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.lockUser = function (username, lockedBy, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        return [4 /*yield*/, DBImpl.lockUser(username, lockedBy, reason)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_8 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.passwordStrengthCheck = function (password) {
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
        if (strongRegex.test(password)) {
            return true;
        }
        else {
            return false;
        }
    };
    return UserService;
}());
exports.default = UserService;
