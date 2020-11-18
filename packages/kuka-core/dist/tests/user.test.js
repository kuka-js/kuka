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
require("reflect-metadata");
var User_1 = require("../service/User");
require("dotenv").config({ path: process.cwd() + "/.env.testing" });
describe("user tests", function () {
    beforeAll(function () { });
    it("registerUser_password_too_weak", function () { return __awaiter(void 0, void 0, void 0, function () {
        var uc, registerUserResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uc = new User_1.default();
                    return [4 /*yield*/, uc.registerUser("nake89@gmail.com", "nake89@gmail.com", "asdaAa1")];
                case 1:
                    registerUserResult = _a.sent();
                    expect(registerUserResult.ok).toBe(0);
                    expect(registerUserResult.data.username).toBe("nake89@gmail.com");
                    expect(registerUserResult.data.message).toBe("Password is too weak");
                    return [2 /*return*/];
            }
        });
    }); });
    it("registerUser_success", function () { return __awaiter(void 0, void 0, void 0, function () {
        var uc, registerUserResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uc = new User_1.default();
                    return [4 /*yield*/, uc.registerUser("nake89@gmail.com", "nake89@gmail.com", "asdaAa12aaaa3!!")];
                case 1:
                    registerUserResult = _a.sent();
                    expect(registerUserResult.ok).toBe(1);
                    expect(registerUserResult.data.username).toBe("nake89@gmail.com");
                    expect(registerUserResult.data.message).toBe("User successfully created!");
                    return [2 /*return*/];
            }
        });
    }); });
    it("registerUser_user_already_exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var uc, registerUserResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uc = new User_1.default();
                    return [4 /*yield*/, uc.registerUser("nake89@gmail.com", "nake89@gmail.com", "asdaAa12aaaa3!!")
                        //expect(registerUserResult.ok).toBe(0)
                    ];
                case 1:
                    registerUserResult = _a.sent();
                    //expect(registerUserResult.ok).toBe(0)
                    expect(registerUserResult.data.username).toBe("nake89@gmail.com");
                    expect(registerUserResult.data.message).toBe("Username taken");
                    return [2 /*return*/];
            }
        });
    }); });
    it("registerAndloginUser_test", function () { return __awaiter(void 0, void 0, void 0, function () {
        var uc, username, password, registerUserResult, loginUserResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uc = new User_1.default();
                    username = "nake89+new@gmail.com";
                    password = "asdaAa12aaaa3!!";
                    return [4 /*yield*/, uc.registerUser(username, username, password)];
                case 1:
                    registerUserResult = _a.sent();
                    return [4 /*yield*/, uc.loginUser(username, password)];
                case 2:
                    loginUserResult = _a.sent();
                    expect(registerUserResult.ok).toBe(1);
                    expect(registerUserResult.data.username).toBe(username);
                    expect(registerUserResult.data.message).toBe("User successfully created!");
                    expect(loginUserResult.ok).toBe(1);
                    expect(typeof loginUserResult.data.token).toBe("string");
                    expect(Number.isInteger(loginUserResult.data.expiry)).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("renewJWTToken_ExpectSuccess", function () { return __awaiter(void 0, void 0, void 0, function () {
        var username, renewTokenResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = "nake89@gmail.com";
                    return [4 /*yield*/, User_1.default.renewJWTToken(username)];
                case 1:
                    renewTokenResult = _a.sent();
                    expect(typeof renewTokenResult.username === "string").toBe(true);
                    expect(renewTokenResult.message).toBe("JWT renewed succesfully.");
                    expect(typeof renewTokenResult.token === "string").toBe(true);
                    expect(Number.isInteger(renewTokenResult.expiry)).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("renewJWTToken_ExpectFailure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var renewUsername, thrown, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renewUsername = "usernotexist@gmail.com";
                    thrown = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, User_1.default.renewJWTToken(renewUsername)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    thrown = true;
                    return [3 /*break*/, 4];
                case 4:
                    expect(thrown).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("getUserList_test", function () { return __awaiter(void 0, void 0, void 0, function () {
        var us, userListResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    us = new User_1.default();
                    return [4 /*yield*/, us.getUserList()];
                case 1:
                    userListResult = _a.sent();
                    expect(Array.isArray(userListResult)).toBe(true);
                    expect(userListResult.length).toBe(2);
                    expect(userListResult[0].username).toBe("nake89@gmail.com");
                    expect(userListResult[0].scopes.includes("root")).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("getUser_ExpectSuccess", function () { return __awaiter(void 0, void 0, void 0, function () {
        var us, userResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    us = new User_1.default();
                    return [4 /*yield*/, us.getUser("nake89@gmail.com")];
                case 1:
                    userResponse = (_a.sent());
                    expect(userResponse.username).toBe("nake89@gmail.com");
                    expect(userResponse.scopes.includes("root")).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("getUser_ExpectFailure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var us, thrown, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    us = new User_1.default();
                    thrown = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, us.getUser("usernotexist@gmail.com")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    thrown = true;
                    return [3 /*break*/, 4];
                case 4:
                    expect(thrown).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("lockUser_ExpectSuccess", function () { return __awaiter(void 0, void 0, void 0, function () {
        var us, lockResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    us = new User_1.default();
                    return [4 /*yield*/, us.lockUser("nake89+new@gmail.com", "nake89@gmail.com", "uncool")];
                case 1:
                    lockResponse = _a.sent();
                    expect(lockResponse).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("lockUser_ExpectFailure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var us, lockResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    us = new User_1.default();
                    return [4 /*yield*/, us.lockUser("notexist@gmail.com", "nake89@gmail.com", "uncool")];
                case 1:
                    lockResponse = _a.sent();
                    expect(lockResponse).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it("loginWithLockedUser_ExpectLoginFail", function () { return __awaiter(void 0, void 0, void 0, function () {
        var us, username, password, loginUserResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    us = new User_1.default();
                    username = "nake89+new@gmail.com";
                    password = "asdaAa12aaaa3!!";
                    return [4 /*yield*/, us.loginUser(username, password)];
                case 1:
                    loginUserResult = _a.sent();
                    expect(loginUserResult.ok).toBe(0);
                    expect(loginUserResult.data.error).toBe("User is locked.");
                    return [2 /*return*/];
            }
        });
    }); });
    it("deleteUser_test", function () { return __awaiter(void 0, void 0, void 0, function () {
        var us, deleteResponse, deleteResponseCheck;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    us = new User_1.default();
                    return [4 /*yield*/, us.deleteUser("nake89+new@gmail.com")];
                case 1:
                    deleteResponse = _a.sent();
                    expect(deleteResponse).toBe(true);
                    return [4 /*yield*/, us.deleteUser("nake89+new@gmail.com")];
                case 2:
                    deleteResponseCheck = _a.sent();
                    expect(deleteResponseCheck).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
