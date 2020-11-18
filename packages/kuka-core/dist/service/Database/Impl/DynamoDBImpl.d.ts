import { DatabaseImpl } from "../DatabaseFactory";
import { CreateUserResponse } from "../Responses";
import { UserModel } from "../../../models/UserModel";
import { VerificationModel } from "../../../models/VerificationModel";
import { PasswordResetModel } from "../../../models/PasswordResetModel";
import { UserObject } from "../../User";
export declare class DynamoDBImpl implements DatabaseImpl {
    createUser(user: UserModel): Promise<CreateUserResponse>;
    getUser(username: string): Promise<UserModel>;
    userExists(username: string): Promise<boolean>;
    updateRefreshToken(username: string, refreshToken: string): Promise<void>;
    deleteUser(username: string): Promise<void>;
    createVerificationLink(verifyObject: VerificationModel): Promise<void>;
    markEmailVerified(verifyLinkId: string): Promise<void>;
    createPasswordReset(passwordResetModel: PasswordResetModel): Promise<void>;
    getPasswordReset(passwordResetId: string): Promise<PasswordResetModel>;
    updatePasswordHash(username: string, passwordHash: string): Promise<void>;
    emailToUsername(email: string): Promise<string>;
    getScopes(username: string): Promise<string[]>;
    addScope(username: string, scope: string): Promise<void>;
    removeScope(username: string, scope: string): Promise<void>;
    getUserList(): Promise<UserObject[]>;
    getRefreshToken(username: string): Promise<string>;
    lockUser(username: string, lockedBy: string, reason: string | null): Promise<boolean>;
    private userModelToDynamoDBModel;
    private dynamoDBToUserModel;
    private verificationModelToDynamoDBModel;
    private dynamoDBToPasswordResetModel;
}
