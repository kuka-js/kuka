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
var uuid_1 = require("uuid");
var User_1 = require("../entities/User");
var Connection_1 = require("./Connection");
var Email_1 = require("./Email");
var PasswordReset_1 = require("../entities/PasswordReset");
var DatabaseFactory_1 = require("./Database/DatabaseFactory");
var logg = require("loglevel");
var log = logg.getLogger("PasswordResetService");
log.setLevel("debug");
var PasswordResetService = /** @class */ (function () {
    function PasswordResetService() {
    }
    PasswordResetService.prototype.markPasswordResetDone = function (passwordResetId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, passwordReset, userId, user, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Connection_1.default.connect()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, false];
                    case 3:
                        _a.trys.push([3, 8, , 9]);
                        return [4 /*yield*/, PasswordReset_1.default.findOne({
                                passwordResetId: passwordResetId
                            })];
                    case 4:
                        passwordReset = _a.sent();
                        passwordReset.clicked = true;
                        userId = passwordReset.username;
                        return [4 /*yield*/, PasswordReset_1.default.save(passwordReset)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, User_1.default.findOne({ id: userId })];
                    case 6:
                        user = _a.sent();
                        user.emailVerified = true;
                        return [4 /*yield*/, User_1.default.save(user)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 8:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, false];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    PasswordResetService.prototype.createPasswordResetLink = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordResetId, DBImpl, passwordResetModel, PW_RESET_LINK_PAGE, emailInstance, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        passwordResetId = uuid_1.v4();
                        try {
                            DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                            passwordResetModel = {
                                passwordResetId: passwordResetId,
                                email: email,
                                clicked: false
                            };
                            log.debug("Inserting password reset link details to DB for email " + email + " ");
                            DBImpl.createPasswordReset(passwordResetModel);
                        }
                        catch (e) {
                            console.log(e);
                            return [2 /*return*/, "false"];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        PW_RESET_LINK_PAGE = process.env.PW_RESET_LINK_PAGE;
                        if (!(process.env.AUTO_SEND_PASSWORD_RESET_ID === "true")) return [3 /*break*/, 2];
                        return [2 /*return*/, passwordResetId];
                    case 2:
                        log.debug("Sending password reset link to customer. " + email);
                        emailInstance = new Email_1.default();
                        return [4 /*yield*/, emailInstance.sendEmail(email, "Reset your password", "You can reset your password from this link: " + PW_RESET_LINK_PAGE + "/" + passwordResetId, process.env.EMAIL_SERVICE)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, "true"];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [2 /*return*/, "false"];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return PasswordResetService;
}());
exports.default = PasswordResetService;
