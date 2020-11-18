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
var Scope_1 = require("../service/Scope");
var User_1 = require("../service/User");
require("dotenv").config({ path: process.cwd() + "/.env.testing" });
var user1 = "nake89@gmail.com";
var user2 = "nake89+1@gmail.com";
describe("scope tests", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var userService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userService = new User_1.default();
                    return [4 /*yield*/, userService.registerUser("nake89@gmail.com", "nake89@gmail.com", "asdaAa12aaaa3!!")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userService.registerUser("nake89+1@gmail.com", "nake89+1@gmail.com", "asdaAa12aaaa3!!")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("getScopes_has_root", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sc, scopeResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sc = new Scope_1.default();
                    return [4 /*yield*/, sc.getScopes(user1)];
                case 1:
                    scopeResult = _a.sent();
                    if (Array.isArray(scopeResult)) {
                        expect(scopeResult.includes("root")).toBe(true);
                    }
                    else {
                        throw "ScopeResult returned a boolean";
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it("getScopes_does_not_have_root", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sc, scopeResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sc = new Scope_1.default();
                    return [4 /*yield*/, sc.getScopes(user2)];
                case 1:
                    scopeResult = _a.sent();
                    if (Array.isArray(scopeResult)) {
                        expect(scopeResult.includes("root")).toBe(false);
                    }
                    else {
                        throw "ScopeResult returned a boolean";
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it("addScope_adds_scope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sc, scopeResult, scopeResultList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sc = new Scope_1.default();
                    return [4 /*yield*/, sc.addScope(user2, "test_scope")];
                case 1:
                    scopeResult = _a.sent();
                    return [4 /*yield*/, sc.getScopes(user2)];
                case 2:
                    scopeResultList = _a.sent();
                    expect(scopeResult).toBeTruthy;
                    if (Array.isArray(scopeResultList)) {
                        expect(scopeResultList.includes("test_scope")).toBe(true);
                    }
                    else {
                        throw "ScopeResultList returned a boolean";
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it("removeScope_removes_scope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sc, scopeResult, scopeResultList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sc = new Scope_1.default();
                    return [4 /*yield*/, sc.removeScope(user2, "test_scope")];
                case 1:
                    scopeResult = _a.sent();
                    return [4 /*yield*/, sc.getScopes(user2)];
                case 2:
                    scopeResultList = _a.sent();
                    expect(scopeResult).toBeTruthy;
                    if (Array.isArray(scopeResultList)) {
                        expect(scopeResultList.includes("test_scope")).toBe(false);
                    }
                    else {
                        throw "ScopeResultList returned a boolean";
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
