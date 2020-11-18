import { CreateUserResponse } from "../Responses";
import { UserModel } from "../../../models/UserModel";
import { DatabaseImpl } from "../DatabaseFactory";
import { VerificationModel } from "../../../models/VerificationModel";
import { PasswordResetModel } from "../../../models/PasswordResetModel";
import { UserObject } from "../../User";
export declare class TypeORMImpl implements DatabaseImpl {
    createUser(userModel: UserModel): Promise<CreateUserResponse>;
    deleteUser(username: string): Promise<void>;
    lockUser(username: string, lockedBy: string, reason: string | null): Promise<boolean>;
    getUser(username: string): Promise<UserModel>;
    userExists(username: string): Promise<boolean>;
    updateRefreshToken(username: string, refreshToken: string): Promise<void>;
    getRefreshToken(username: string): Promise<string>;
    createVerificationLink(verificationObject: VerificationModel): Promise<void>;
    markEmailVerified(verifyLinkId: string): Promise<void>;
    createPasswordReset(passwordResetModel: PasswordResetModel): Promise<void>;
    getPasswordReset(passwordResetId: string): Promise<PasswordResetModel>;
    updatePasswordHash(username: string, passwordHash: string): Promise<void>;
    emailToUsername(email: string): Promise<string>;
    getScopes(username: string): Promise<string[]>;
    addScope(username: string, scope: string): Promise<void>;
    removeScope(username: string, scope: string): Promise<void>;
    getUserList(): Promise<UserObject[]>;
}
