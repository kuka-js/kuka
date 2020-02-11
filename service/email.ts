import {SES, AWSError} from "aws-sdk"
import {SendEmailRequest, SendEmailResponse} from "aws-sdk/clients/ses"
// const nodemailer = require("nodemailer")
import * as nodemailer from "nodemailer"

export interface OurMailResponse {
  ok: number
  emailService?: string
  error?: string
}
export default class Email {
  async sendEmail(
    email: string,
    subject: string,
    message: string,
    emailService: string
  ): Promise<OurMailResponse> {
    const STAGE = process.env.STAGE
    const VER_RECIPIENT = process.env.VER_RECIPIENT
    const VER_SENDER = process.env.VER_SENDER
    const recipient: string =
      STAGE == "development" || STAGE == "local" ? VER_RECIPIENT : email
    if (emailService.toLowerCase() == "aws") {
      const ses = new SES({region: "eu-central-1"})
      const sender: string = VER_SENDER
      const charset: string = "UTF-8"
      const body: string = message
      const html: string = message

      const params: SendEmailRequest = {
        Source: sender,
        Destination: {
          ToAddresses: [recipient]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: charset
          },
          Body: {
            Text: {
              Data: body,
              Charset: charset
            },
            Html: {
              Data: html,
              Charset: charset
            }
          }
        }
      }
      let sesResult: SendEmailResponse
      try {
        sesResult = await ses.sendEmail(params).promise()
        return {ok: 1, emailService}
      } catch (e) {
        console.log(e)
        return {ok: 0, emailService}
      }
    } else if (emailService.toLowerCase() == "smtp") {
      let transporter
      transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE == "true" ? true : false,
        auth:
          process.env.MAIL_NO_AUTH == "true"
            ? undefined
            : {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
              }
      })

      let info = await transporter.sendMail({
        from: `"Helpdesk" <${VER_SENDER}>`, // sender address
        to: recipient, // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
        html: message // html body
      })

      return {ok: 1, emailService}
    } else {
      return {ok: 0, emailService}
    }
  }
}
