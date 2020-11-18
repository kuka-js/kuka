import { LoginUserResponse } from "./Responses/LoginUserResponse";
import { RenewJWTModel } from "../models/RenewJWTModel";
export default class UserService {
    changePassword(passwordResetId: any, password1: any, password2: any): Promise<{
        ok: number;
        data: {
            error: string;
            message: string;
        };
    } | {
        ok: number;
        data: {
            message: string;
            error?: undefined;
        };
    }>;
    registerUser(username: string, email: string, password: string): Promise<SaveUserResponse>;
    loginUser(username: string, password: string): Promise<LoginUserResponse>;
    static renewJWTToken(username: string): Promise<RenewJWTModel>;
    emailToUsername(email: string): Promise<string>;
    getUserList(): Promise<UserObject[]>;
    getUser(username: string): Promise<UserObject | null>;
    deleteUser(username: string): Promise<boolean>;
    lockUser(username: string, lockedBy: string, reason: string | null): Promise<boolean>;
    private passwordStrengthCheck;
}
interface SaveUserResponse {
    ok: number;
    data: {
        userId?: string;
        error?: string;
        username: string;
        message: string;
    };
}
export interface UserObject {
    userId?: string;
    username: string;
    scopes: string[];
    isLocked?: string;
}
export {};
