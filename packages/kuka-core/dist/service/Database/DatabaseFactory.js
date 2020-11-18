"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDBAdapter = exports.convert = exports.DatabaseTypes = void 0;
var DynamoDBImpl_1 = require("./Impl/DynamoDBImpl");
var TypeORMImpl_1 = require("./Impl/TypeORMImpl");
var DatabaseTypes;
(function (DatabaseTypes) {
    DatabaseTypes[DatabaseTypes["DYNAMODB"] = 0] = "DYNAMODB";
    DatabaseTypes[DatabaseTypes["TYPEORM"] = 1] = "TYPEORM";
})(DatabaseTypes = exports.DatabaseTypes || (exports.DatabaseTypes = {}));
function convert(provider) {
    // If you are wondering the "... as keyof typeof ...". Read about it here:
    // https://stackoverflow.com/questions/36316326/typescript-ts7015-error-when-accessing-an-enum-using-a-string-type-parameter
    return DatabaseTypes[provider.toUpperCase()];
}
exports.convert = convert;
function CreateDBAdapter(type) {
    switch (type) {
        case DatabaseTypes.DYNAMODB:
            return new DynamoDBImpl_1.DynamoDBImpl();
            break;
        case DatabaseTypes.TYPEORM:
            return new TypeORMImpl_1.TypeORMImpl();
            break;
        default:
            throw "an error";
    }
}
exports.CreateDBAdapter = CreateDBAdapter;
