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
exports.TypeORMImpl = void 0;
var Connection_1 = require("../../Connection");
var User_1 = require("../../../entities/User");
var Scope_1 = require("../../../entities/Scope");
var Verification_1 = require("../../Verification");
var UserDoesNotExistException_1 = require("../../../exceptions/UserDoesNotExistException");
var DBConncetionException_1 = require("../../../exceptions/DBConncetionException");
var Verification_2 = require("../../../entities/Verification");
var User_2 = require("../../User");
var PasswordReset_1 = require("../../../entities/PasswordReset");
var DBQueryFailedException_1 = require("../../../exceptions/DBQueryFailedException");
var Lock_1 = require("../../../entities/Lock");
var TypeORMImpl = /** @class */ (function () {
    function TypeORMImpl() {
    }
    TypeORMImpl.prototype.createUser = function (userModel) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, username, passwordHash, email, emailVerified, connection, findCount, userCount, firstUser, user, defaultScope, rootScope, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = userModel.userId, username = userModel.username, passwordHash = userModel.passwordHash, email = userModel.email, emailVerified = userModel.emailVerified;
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        connection = _a.sent();
                        if (!connection) return [3 /*break*/, 12];
                        return [4 /*yield*/, User_1.default.findAndCount()];
                    case 2:
                        findCount = _a.sent();
                        userCount = findCount[1];
                        firstUser = void 0;
                        if (!userCount || userCount == 0) {
                            firstUser = true;
                        }
                        else {
                            firstUser = false;
                        }
                        return [4 /*yield*/, this.userExists(username)];
                    case 3:
                        if (_a.sent()) {
                            return [2 /*return*/, {
                                    ok: 0,
                                    data: {
                                        error: "Couldn't create user. User exists",
                                        message: "Couldn't create user. User exists",
                                    },
                                }];
                        }
                        user = new User_1.default();
                        user.id = userId;
                        user.username = username;
                        user.passwordHash = passwordHash;
                        user.email = email;
                        user.emailVerified = emailVerified;
                        defaultScope = new Scope_1.default();
                        defaultScope.scope = "default";
                        return [4 /*yield*/, Scope_1.default.save(defaultScope)];
                    case 4:
                        _a.sent();
                        user.scopes = [defaultScope];
                        if (!firstUser) return [3 /*break*/, 6];
                        rootScope = new Scope_1.default();
                        rootScope.scope = "root";
                        return [4 /*yield*/, Scope_1.default.save(rootScope)];
                    case 5:
                        _a.sent();
                        user.scopes.push(rootScope);
                        _a.label = 6;
                    case 6: return [4 /*yield*/, User_1.default.save(user)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, Verification_1.default.createVerificationLink({ username: username, email: email })];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        e_1 = _a.sent();
                        throw e_1;
                    case 11: return [2 /*return*/, {
                            ok: 1,
                            data: {
                                message: "User successfully created!",
                            },
                        }];
                    case 12: throw new DBConncetionException_1.DBConnectionException();
                }
            });
        });
    };
    TypeORMImpl.prototype.deleteUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, user, userRemoveResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        connection = _a.sent();
                        if (!connection) return [3 /*break*/, 4];
                        return [4 /*yield*/, User_1.default.findOne({ username: username })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new UserDoesNotExistException_1.UserDoesNotExistException();
                        }
                        return [4 /*yield*/, User_1.default.remove(user)];
                    case 3:
                        userRemoveResponse = _a.sent();
                        if (!userRemoveResponse) {
                            throw new DBConncetionException_1.DBConnectionException();
                        }
                        return [3 /*break*/, 5];
                    case 4: throw "Connection problem";
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.lockUser = function (username, lockedBy, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, user, lock, lockResult, lockId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        connection = _a.sent();
                        if (!connection) return [3 /*break*/, 5];
                        return [4 /*yield*/, User_1.default.findOne({ username: username })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, false];
                        }
                        lock = new Lock_1.default();
                        lock.lockedBy = lockedBy;
                        lock.lockedAt = new Date();
                        lock.reason = reason;
                        lock.username = username;
                        return [4 /*yield*/, Lock_1.default.save(lock)];
                    case 3:
                        lockResult = _a.sent();
                        lockId = lockResult.id;
                        user.lockId = lockId;
                        return [4 /*yield*/, User_1.default.save(user)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5: throw "Connection problem";
                }
            });
        });
    };
    TypeORMImpl.prototype.getUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var convert, connection, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        convert = function (user) {
                            var scopeArray = user.scopes;
                            var scopes = scopeArray.map(function (item) {
                                return item.scope;
                            });
                            var id = user.id, username = user.username, email = user.email, emailVerified = user.emailVerified, passwordHash = user.passwordHash, refreshToken = user.refreshToken, lockId = user.lockId;
                            return {
                                userId: id,
                                username: username,
                                email: email,
                                emailVerified: emailVerified,
                                passwordHash: passwordHash,
                                refreshToken: refreshToken,
                                lockId: lockId,
                                scopes: scopes,
                            };
                        };
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        connection = _a.sent();
                        if (!connection) return [3 /*break*/, 3];
                        return [4 /*yield*/, User_1.default.findOne({ username: username }, { relations: ["scopes"] })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new UserDoesNotExistException_1.UserDoesNotExistException();
                        }
                        return [2 /*return*/, convert(user)];
                    case 3: throw new DBConncetionException_1.DBConnectionException();
                }
            });
        });
    };
    TypeORMImpl.prototype.userExists = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, User_1.default.findOne({ username: username })];
                    case 2:
                        user = _a.sent();
                        if (user === undefined) {
                            return [2 /*return*/, false];
                        }
                        else {
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.updateRefreshToken = function (username, refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        connection = _a.sent();
                        if (!connection) return [3 /*break*/, 6];
                        return [4 /*yield*/, User_1.default.findOne({ username: username }, { relations: ["scopes"] })];
                    case 2:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 3];
                        throw new UserDoesNotExistException_1.UserDoesNotExistException();
                    case 3:
                        user.refreshToken = refreshToken;
                        return [4 /*yield*/, User_1.default.save(user)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6: throw new DBConncetionException_1.DBConnectionException();
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.getRefreshToken = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3, user, refreshTokenFromDB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        throw e_3;
                    case 3: return [4 /*yield*/, User_1.default.findOne({ username: username })];
                    case 4:
                        user = _a.sent();
                        refreshTokenFromDB = user.refreshToken;
                        return [2 /*return*/, refreshTokenFromDB];
                }
            });
        });
    };
    TypeORMImpl.prototype.createVerificationLink = function (verificationObject) {
        return __awaiter(this, void 0, void 0, function () {
            var username, verifyLinkId, clicked, verification, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        username = verificationObject.username, verifyLinkId = verificationObject.verifyLinkId, clicked = verificationObject.clicked;
                        verification = new Verification_2.default();
                        verification.username = username;
                        verification.verifyLinkId = verifyLinkId;
                        verification.clicked = clicked;
                        return [4 /*yield*/, Verification_2.default.save(verification)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        console.log(e_4);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.markEmailVerified = function (verifyLinkId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_5, verification, username, user, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 3:
                        _a.trys.push([3, 8, , 9]);
                        return [4 /*yield*/, Verification_2.default.findOne({
                                verifyLinkId: verifyLinkId,
                            })];
                    case 4:
                        verification = _a.sent();
                        verification.clicked = true;
                        username = verification.username;
                        return [4 /*yield*/, Verification_2.default.save(verification)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, User_1.default.findOne({ username: username })];
                    case 6:
                        user = _a.sent();
                        user.emailVerified = true;
                        return [4 /*yield*/, User_1.default.save(user)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_6 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.createPasswordReset = function (passwordResetModel) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordResetId, email, clicked, userService, passwordReset, _a, e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _b.sent();
                        passwordResetId = passwordResetModel.passwordResetId, email = passwordResetModel.email, clicked = passwordResetModel.clicked;
                        userService = new User_2.default();
                        passwordReset = new PasswordReset_1.default();
                        _a = passwordReset;
                        return [4 /*yield*/, userService.emailToUsername(email)];
                    case 2:
                        _a.username = _b.sent();
                        passwordReset.passwordResetId = passwordResetId;
                        passwordReset.email = email;
                        passwordReset.clicked = clicked;
                        return [4 /*yield*/, PasswordReset_1.default.save(passwordReset)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_7 = _b.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.getPasswordReset = function (passwordResetId) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordReset, username, email, creationDate, clicked, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, PasswordReset_1.default.findOne({
                                passwordResetId: passwordResetId,
                            })];
                    case 2:
                        passwordReset = _a.sent();
                        username = passwordReset.username, email = passwordReset.email, creationDate = passwordReset.creationDate, clicked = passwordReset.clicked;
                        return [2 /*return*/, {
                                username: username,
                                email: email,
                                creationDate: creationDate.toISOString(),
                                clicked: clicked,
                                passwordResetId: passwordResetId,
                            }];
                    case 3:
                        e_8 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.updatePasswordHash = function (username, passwordHash) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, User_1.default.findOne({ username: username })];
                    case 2:
                        user = _a.sent();
                        user.passwordHash = passwordHash;
                        return [4 /*yield*/, User_1.default.save(user)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_9 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.emailToUsername = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var findUser, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, User_1.default.findOne({ email: email })];
                    case 2:
                        findUser = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_10 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4:
                        if (findUser) {
                            return [2 /*return*/, findUser.username];
                        }
                        else {
                            throw new DBQueryFailedException_1.DBQueryFailedException();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.getScopes = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var e_11, user, scopeArray, scopes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_11 = _a.sent();
                        console.log(e_11);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 3: return [4 /*yield*/, User_1.default.findOne({ username: username })];
                    case 4:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 6];
                        return [4 /*yield*/, Scope_1.default.find({ user: user })];
                    case 5:
                        scopeArray = _a.sent();
                        scopes = scopeArray.map(function (item) {
                            return item.scope;
                        });
                        return [2 /*return*/, scopes];
                    case 6: throw new DBQueryFailedException_1.DBQueryFailedException();
                }
            });
        });
    };
    TypeORMImpl.prototype.addScope = function (username, scope) {
        return __awaiter(this, void 0, void 0, function () {
            var e_12, user, _i, _a, item, newScope;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_12 = _b.sent();
                        console.log(e_12);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 3: return [4 /*yield*/, User_1.default.findOne({ username: username }, { relations: ["scopes"] })];
                    case 4:
                        user = _b.sent();
                        if (!user) return [3 /*break*/, 7];
                        for (_i = 0, _a = user.scopes; _i < _a.length; _i++) {
                            item = _a[_i];
                            if (item.scope == scope) {
                                throw new DBQueryFailedException_1.DBQueryFailedException();
                            }
                        }
                        newScope = new Scope_1.default();
                        newScope.scope = scope;
                        return [4 /*yield*/, Scope_1.default.save(newScope)];
                    case 5:
                        _b.sent();
                        user.scopes.push(newScope);
                        return [4 /*yield*/, User_1.default.save(user)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: throw new DBQueryFailedException_1.DBQueryFailedException();
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.removeScope = function (username, scope) {
        return __awaiter(this, void 0, void 0, function () {
            var e_13, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_13 = _a.sent();
                        console.log(e_13);
                        console.log(e_13);
                        throw new DBQueryFailedException_1.DBQueryFailedException();
                    case 3: return [4 /*yield*/, User_1.default.findOne({ username: username }, { relations: ["scopes"] })];
                    case 4:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 6];
                        user.scopes = user.scopes.filter(function (e) { return e.scope !== scope; });
                        return [4 /*yield*/, User_1.default.save(user)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new DBQueryFailedException_1.DBQueryFailedException();
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TypeORMImpl.prototype.getUserList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection, users, userList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        connection = _a.sent();
                        if (!connection) return [3 /*break*/, 3];
                        return [4 /*yield*/, User_1.default.find({ relations: ["scopes"] })];
                    case 2:
                        users = _a.sent();
                        userList = users.map(function (item) {
                            var userId = item.id;
                            var username = item.username;
                            var scopes = item.scopes.map(function (scope) {
                                return scope.scope;
                            });
                            var isLocked;
                            if (item.lockId) {
                                isLocked = "true";
                            }
                            else {
                                isLocked = "false";
                            }
                            var user = {
                                userId: userId,
                                username: username,
                                scopes: scopes,
                                isLocked: isLocked,
                            };
                            return user;
                        });
                        return [2 /*return*/, userList];
                    case 3: throw "Connection problem";
                }
            });
        });
    };
    return TypeORMImpl;
}());
exports.TypeORMImpl = TypeORMImpl;
