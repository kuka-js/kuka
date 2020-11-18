export interface UserModel {
    userId?: string;
    username: string;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    refreshToken?: string;
    scopes: string[];
    lockId?: number;
}
