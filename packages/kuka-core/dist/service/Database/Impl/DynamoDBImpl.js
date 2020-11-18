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
exports.DynamoDBImpl = void 0;
var aws_sdk_1 = require("aws-sdk");
var UserDoesNotExistException_1 = require("../../../exceptions/UserDoesNotExistException");
var DBConncetionException_1 = require("../../../exceptions/DBConncetionException");
var User_1 = require("../../User");
var DBQueryFailedException_1 = require("../../../exceptions/DBQueryFailedException");
var logg = require("loglevel");
var log = logg.getLogger("DynamoDBImpl");
log.setLevel("debug");
if (process.env.STAGE == "local") {
    var credentials = new aws_sdk_1.SharedIniFileCredentials({ profile: "kuka-dynamo" });
    aws_sdk_1.config.credentials = credentials;
}
aws_sdk_1.config.update({ region: "eu-north-1" });
var docClient = new aws_sdk_1.DynamoDB.DocumentClient();
var DynamoDBImpl = /** @class */ (function () {
    function DynamoDBImpl() {
    }
    DynamoDBImpl.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var userModel, params, addEmailSK, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userModel = this.userModelToDynamoDBModel(user);
                        params = { TableName: "kuka-users", Item: userModel };
                        addEmailSK = {
                            TableName: "kuka-users",
                            Item: { pk: userModel.pk, sk: "EMAIL#" + userModel.email },
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, docClient.put(params).promise()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, docClient.put(addEmailSK).promise()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { ok: 1, data: { message: "User succesfully created!" } }];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, {
                                ok: 0,
                                data: {
                                    message: e_1.message,
                                },
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.getUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var pksk, params, result, userModel, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pksk = "USER#" + username;
                        params = {
                            TableName: "kuka-users",
                            Key: { pk: pksk, sk: pksk },
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, docClient.get(params).promise()];
                    case 2:
                        result = _a.sent();
                        if (!result || !result.Item) {
                            throw new UserDoesNotExistException_1.UserDoesNotExistException();
                        }
                        else {
                            userModel = this.dynamoDBToUserModel(result.Item);
                            return [2 /*return*/, userModel];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.log(e_2);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.userExists = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var key, params, result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = "USER#" + username;
                        params = {
                            TableName: "kuka-users",
                            Key: { pk: key, sk: key },
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, docClient.get(params).promise()];
                    case 2:
                        result = _a.sent();
                        console.log("User exist result");
                        console.log(result);
                        if (result && result.Item && result.Item.pk === "USER#" + username) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        console.log(e_3);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.updateRefreshToken = function (username, refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var key, params, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        key = "USER#" + username;
                        params = {
                            TableName: "kuka-users",
                            Key: { pk: key, sk: key },
                            UpdateExpression: "set refreshToken = :r",
                            ExpressionAttributeValues: {
                                ":r": refreshToken,
                            },
                        };
                        return [4 /*yield*/, docClient.update(params).promise()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        console.log(e_4);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.deleteUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var pksk, params, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pksk = "USER#" + username;
                        params = {
                            TableName: "kuka-users",
                            Key: { pk: pksk, sk: pksk },
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, docClient.delete(params).promise()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _a.sent();
                        console.log(e_5);
                        throw new DBQueryFailedException_1.DBQueryFailedException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.createVerificationLink = function (verifyObject) {
        return __awaiter(this, void 0, void 0, function () {
            var params, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: "kuka-users",
                            Item: this.verificationModelToDynamoDBModel(verifyObject),
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, docClient.put(params).promise()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_6 = _a.sent();
                        console.log(e_6);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.markEmailVerified = function (verifyLinkId) {
        return __awaiter(this, void 0, void 0, function () {
            var sk, getVerifyParams, verifyItem, pk, emailVerifiedToUserItem, emailVerifiedToVerifyItem, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sk = "VER#" + verifyLinkId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        getVerifyParams = {
                            TableName: "kuka-users",
                            IndexName: "sk-pk-index",
                            KeyConditionExpression: "sk = :sk AND begins_with(pk, :pk)",
                            ExpressionAttributeValues: {
                                ":sk": sk,
                                ":pk": "USER#",
                            },
                        };
                        return [4 /*yield*/, docClient.query(getVerifyParams).promise()];
                    case 2:
                        verifyItem = _a.sent();
                        log.debug("verifyItem");
                        log.debug(verifyItem);
                        if (verifyItem.Items.length != 1) {
                            throw new DBQueryFailedException_1.DBQueryFailedException();
                        }
                        pk = verifyItem.Items[0].pk;
                        emailVerifiedToUserItem = {
                            TableName: "kuka-users",
                            Key: {
                                pk: pk,
                                sk: sk,
                            },
                            UpdateExpression: "set emailVerified = :bool",
                            ExpressionAttributeValues: {
                                ":bool": true,
                            },
                        };
                        return [4 /*yield*/, docClient.update(emailVerifiedToUserItem).promise()];
                    case 3:
                        _a.sent();
                        emailVerifiedToVerifyItem = {
                            TableName: "kuka-users",
                            Key: {
                                pk: pk,
                                sk: pk,
                            },
                            UpdateExpression: "set emailVerified = :bool",
                            ExpressionAttributeValues: {
                                ":bool": true,
                            },
                        };
                        return [4 /*yield*/, docClient.update(emailVerifiedToVerifyItem).promise()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_7 = _a.sent();
                        console.log(e_7);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.createPasswordReset = function (passwordResetModel) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordResetId, email, clicked, userService, username, date, creationDate, passwordResetItem, params, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        passwordResetId = passwordResetModel.passwordResetId, email = passwordResetModel.email, clicked = passwordResetModel.clicked;
                        userService = new User_1.default();
                        return [4 /*yield*/, userService.emailToUsername(email)];
                    case 1:
                        username = _a.sent();
                        date = new Date();
                        creationDate = date.toISOString();
                        passwordResetItem = {
                            pk: "USER#" + username,
                            sk: "PWRESET#" + passwordResetId,
                            email: email,
                            clicked: clicked,
                            creationDate: creationDate,
                        };
                        params = {
                            TableName: "kuka-users",
                            Item: passwordResetItem,
                        };
                        return [4 /*yield*/, docClient.put(params).promise()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.getPasswordReset = function (passwordResetId) {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, resetModel, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = {
                            TableName: "kuka-users",
                            IndexName: "sk-pk-index",
                            KeyConditionExpression: "sk = :sk AND begins_with(pk, :pk)",
                            ExpressionAttributeValues: {
                                ":sk": "PWRESET#" + passwordResetId,
                                ":pk": "USER#",
                            },
                        };
                        log.debug("getPasswordReset params");
                        log.debug(params);
                        return [4 /*yield*/, docClient.query(params).promise()];
                    case 1:
                        result = _a.sent();
                        log.debug("getPWResetResult");
                        log.debug(result);
                        if (result.Items.length != 1) {
                            throw new DBQueryFailedException_1.DBQueryFailedException();
                        }
                        resetModel = this.dynamoDBToPasswordResetModel(result.Items[0]);
                        return [2 /*return*/, resetModel];
                    case 2:
                        e_9 = _a.sent();
                        console.log(e_9);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.updatePasswordHash = function (username, passwordHash) {
        return __awaiter(this, void 0, void 0, function () {
            var pksk, params, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pksk = "USER#" + username;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        params = {
                            TableName: "kuka-users",
                            Key: {
                                pk: pksk,
                                sk: pksk,
                            },
                            UpdateExpression: "set passwordHash = :r",
                            ExpressionAttributeValues: {
                                ":r": passwordHash,
                            },
                        };
                        log.debug("updatePasswordHash params");
                        log.debug(params);
                        log.debug("Updating password hash");
                        return [4 /*yield*/, docClient.update(params).promise()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_10 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.emailToUsername = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, e_11, username;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: "kuka-users",
                            IndexName: "sk-pk-index",
                            KeyConditionExpression: "sk  = :email",
                            ExpressionAttributeValues: {
                                ":email": "EMAIL#" + email,
                            },
                            ProjectionExpression: "pk",
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, docClient.query(params).promise()];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_11 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4:
                        if (Array.isArray(result.Items) && result.Items.length > 0) {
                            username = result.Items[0].pk.split("#")[1];
                            return [2 /*return*/, username];
                        }
                        else {
                            throw new DBQueryFailedException_1.DBQueryFailedException();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.getScopes = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var pksk, params, result, e_12, scopes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("getScopes username: " + username);
                        pksk = "USER#" + username;
                        params = {
                            TableName: "kuka-users",
                            Key: { pk: pksk, sk: pksk },
                            ProjectionExpression: "scopes",
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, docClient.get(params).promise()];
                    case 2:
                        result = _a.sent();
                        log.debug("getScopes result:");
                        log.debug(result);
                        return [3 /*break*/, 4];
                    case 3:
                        e_12 = _a.sent();
                        log.debug(e_12);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4:
                        scopes = result.Item.scopes;
                        log.debug("getScopes scopes var:");
                        log.debug(scopes);
                        return [2 /*return*/, scopes];
                }
            });
        });
    };
    DynamoDBImpl.prototype.addScope = function (username, scope) {
        return __awaiter(this, void 0, void 0, function () {
            var scopes, _i, scopes_1, item, pksk, params, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getScopes(username)];
                    case 1:
                        scopes = _a.sent();
                        for (_i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
                            item = scopes_1[_i];
                            if (item == scope) {
                                throw new DBQueryFailedException_1.DBQueryFailedException();
                            }
                        }
                        scopes.push(scope);
                        pksk = "USER#" + username;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        params = {
                            TableName: "kuka-users",
                            Key: {
                                pk: pksk,
                                sk: pksk,
                            },
                            UpdateExpression: "set scopes = :r",
                            ExpressionAttributeValues: {
                                ":r": scopes,
                            },
                        };
                        return [4 /*yield*/, docClient.update(params).promise()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_13 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.removeScope = function (username, scope) {
        return __awaiter(this, void 0, void 0, function () {
            var scopes, newScopes, pksk, params, e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getScopes(username)];
                    case 1:
                        scopes = _a.sent();
                        newScopes = scopes.filter(function (e) { return e !== scope; });
                        pksk = "USER#" + username;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        params = {
                            TableName: "kuka-users",
                            Key: {
                                pk: pksk,
                                sk: pksk,
                            },
                            UpdateExpression: "set scopes = :r",
                            ExpressionAttributeValues: {
                                ":r": newScopes,
                            },
                        };
                        return [4 /*yield*/, docClient.update(params).promise()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_14 = _a.sent();
                        throw new DBConncetionException_1.DBConnectionException();
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.getUserList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, userList, _i, _a, item, userData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = {
                            TableName: "kuka-users",
                            ProjectionExpression: "pk, scopes, locked",
                            FilterExpression: "begins_with(sk, :sk) AND begins_with(pk, :pk)",
                            ExpressionAttributeValues: {
                                ":sk": "USER#",
                                ":pk": "USER#",
                            },
                        };
                        return [4 /*yield*/, docClient.scan(params).promise()];
                    case 1:
                        result = _b.sent();
                        userList = [];
                        for (_i = 0, _a = result.Items; _i < _a.length; _i++) {
                            item = _a[_i];
                            userData = {
                                username: item.pk.split("#")[1],
                                scopes: item.scopes,
                                isLocked: item.locked,
                            };
                            userList.push(userData);
                        }
                        return [2 /*return*/, userList];
                }
            });
        });
    };
    DynamoDBImpl.prototype.getRefreshToken = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var pksk, params, result, e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pksk = "USER#" + username;
                        params = {
                            TableName: "kuka-users",
                            ProjectionExpression: "refreshToken",
                            Key: { pk: pksk, sk: pksk },
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, docClient.get(params).promise()];
                    case 2:
                        result = _a.sent();
                        if (!result || !result.Item) {
                            throw new UserDoesNotExistException_1.UserDoesNotExistException();
                        }
                        else {
                            return [2 /*return*/, result.Item.refreshToken];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_15 = _a.sent();
                        console.log(e_15);
                        throw new DBConncetionException_1.DBConnectionException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.lockUser = function (username, lockedBy, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var lock, params, e_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lock = {
                            pk: "LOCK#" + username,
                            sk: "LOCK#" + username,
                            lockedBy: lockedBy,
                            reason: reason,
                        };
                        params = { TableName: "kuka-users", Item: lock };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, docClient.put(params).promise()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_16 = _a.sent();
                        console.log(e_16);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDBImpl.prototype.userModelToDynamoDBModel = function (user) {
        var username = user.username, email = user.email, passwordHash = user.passwordHash, emailVerified = user.emailVerified, refreshToken = user.refreshToken, scopes = user.scopes, lockId = user.lockId;
        return {
            pk: "USER#" + username,
            sk: "USER#" + username,
            email: email,
            passwordHash: passwordHash,
            emailVerified: emailVerified,
            refreshToken: refreshToken,
            scopes: scopes,
            lockId: lockId,
        };
    };
    DynamoDBImpl.prototype.dynamoDBToUserModel = function (user) {
        var pk = user.pk, email = user.email, passwordHash = user.passwordHash, emailVerified = user.emailVerified, refreshToken = user.refreshToken, scopes = user.scopes, lockId = user.lockId;
        return {
            username: pk.split("#")[1],
            email: email,
            passwordHash: passwordHash,
            emailVerified: emailVerified,
            refreshToken: refreshToken,
            scopes: scopes,
            lockId: lockId,
        };
    };
    DynamoDBImpl.prototype.verificationModelToDynamoDBModel = function (verification) {
        return {
            pk: "USER#" + verification.username,
            sk: "VER#" + verification.verifyLinkId,
            emailVerified: verification.clicked,
        };
    };
    DynamoDBImpl.prototype.dynamoDBToPasswordResetModel = function (reset) {
        var pk = reset.pk, sk = reset.sk, email = reset.email, creationDate = reset.creationDate, clicked = reset.clicked;
        return {
            username: pk.split("#")[1],
            passwordResetId: sk.split("#")[1],
            email: email,
            creationDate: creationDate,
            clicked: clicked,
        };
    };
    return DynamoDBImpl;
}());
exports.DynamoDBImpl = DynamoDBImpl;
