import { CreateVerificationLinkRequest } from "./Requests/CreateVerificationLinkRequest";
export default class VerificationService {
    markEmailVerified(verifyLinkId: string): Promise<void>;
    static createVerificationLink(request: CreateVerificationLinkRequest): Promise<void>;
}
