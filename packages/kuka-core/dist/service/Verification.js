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
var Email_1 = require("./Email");
var DatabaseFactory_1 = require("./Database/DatabaseFactory");
var VerificationService = /** @class */ (function () {
    function VerificationService() {
    }
    VerificationService.prototype.markEmailVerified = function (verifyLinkId) {
        return __awaiter(this, void 0, void 0, function () {
            var DBImpl;
            return __generator(this, function (_a) {
                DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                try {
                    DBImpl.markEmailVerified(verifyLinkId);
                }
                catch (e) {
                    // throws DBConnectionException
                    throw e;
                }
                return [2 /*return*/];
            });
        });
    };
    VerificationService.createVerificationLink = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var email, username, verifyLinkId, clicked, DBImpl, emailInstance, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = request.email, username = request.username;
                        verifyLinkId = uuid_1.v4();
                        if (process.env.AUTO_VERIFY_MAIL == "true") {
                            clicked = true;
                        }
                        else {
                            clicked = false;
                        }
                        DBImpl = DatabaseFactory_1.CreateDBAdapter(DatabaseFactory_1.convert(process.env.DB_PROVIDER));
                        try {
                            DBImpl.createVerificationLink({
                                verifyLinkId: verifyLinkId,
                                username: username,
                                clicked: clicked,
                            });
                        }
                        catch (e) {
                            // throws DBConnectionException
                            throw e;
                        }
                        if (!!(process.env.STAGE == "test")) return [3 /*break*/, 4];
                        if (!!(process.env.AUTO_VERIFY_MAIL == "true")) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        emailInstance = new Email_1.default();
                        return [4 /*yield*/, emailInstance.sendEmail(email, "Verify your email address", "Please verify your email address by clicking this link: " + process.env.VERIFICATION_LINK_URL + verifyLinkId, process.env.EMAIL_SERVICE)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        // throws EmailSendException, UnkownEmailServiceException
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return VerificationService;
}());
exports.default = VerificationService;
