export default class RefreshTokenService {
    static refreshToken(username: string, oldRefreshToken: string): Promise<RefreshTokenServiceResponse>;
    static compareRefreshTokens(oldRefreshToken: string, newRefreshToken: string): boolean;
    static generateRefreshToken(): string;
    static getCookiesFromHeader(headers: any): {};
}
export interface RefreshTokenServiceResponse {
    ok: number;
    errorCode?: RefreshTokenServiceError;
    errorMessage?: string;
    refreshToken?: string;
}
export declare enum RefreshTokenServiceError {
    CONNECTION_PROBLEM = 0,
    REFRESH_TOKEN_INVALID = 1
}
export interface CookieFromHeader {
    domain: string;
    HttpOnly: string;
    path: string;
    RefreshToken: string;
}
