export default class Email {
    sendEmail(email: string, subject: string, message: string, emailService: string): Promise<void>;
}
