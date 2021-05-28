export default class MailPlugin {
  pluginName: string = "SMTP-MailPlugin"
  constructor() {}
  sendEmail(email: string, subject: string, message: string) {
    console.log(`Email: ${email}
                Subject: ${subject}
                Message; ${message}`)
  }
}
