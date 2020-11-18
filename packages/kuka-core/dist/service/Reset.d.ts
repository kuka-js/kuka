export default class PasswordResetService {
    markPasswordResetDone(passwordResetId: string): Promise<boolean>;
    createPasswordResetLink(email: string): Promise<string>;
}
