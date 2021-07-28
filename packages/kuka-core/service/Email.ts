import { SES, AWSError } from "aws-sdk"
import { SendEmailRequest, SendEmailResponse } from "aws-sdk/clients/ses"
import * as nodemailer from "nodemailer"
import { EmailSendException } from "../exceptions/EmailSendException"
import { UnkownEmailServiceException } from "../exceptions/UnknownEmailServiceException"
import { cosmiconfigSync } from "cosmiconfig"
const axios = require("axios").default

const moduleName = "kuka"
const explorer = cosmiconfigSync(moduleName)
const result = explorer.search()
const STAGE = process.env.STAGE
let config
if (STAGE !== "test") {
  if (result === null) throw new Error("Cant find config file.")
  config = result.config as KukaConfig
} else {
  config = { mailProvider: "SMTP" }
}

interface KukaConfig {
  mailProvider: string
  restMailClientConfig?: {
    url: string
    method: string
    body?: string
    headers?: Headers
  }
}

interface Headers {
  [key: string]: string
}
export default class Email {
  async sendEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    // TODO refactor and make it so that you mail plugins abide by settings
    const VER_RECIPIENT = process.env.VER_RECIPIENT
    const VER_SENDER = process.env.VER_SENDER
    const recipient: string =
      STAGE == "development" ||
      STAGE == "test" ||
      STAGE == "local" ||
      STAGE == "CI"
        ? VER_RECIPIENT
        : email

    if (config.mailProvider === "AWSSES") {
      const ses = new SES({ region: "eu-central-1" })
      const sender: string = VER_SENDER
      const charset: string = "UTF-8"
      const body: string = message
      const html: string = message

      const params: SendEmailRequest = {
        Source: sender,
        Destination: {
          ToAddresses: [recipient],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: charset,
          },
          Body: {
            Text: {
              Data: body,
              Charset: charset,
            },
            Html: {
              Data: html,
              Charset: charset,
            },
          },
        },
      }
      let sesResult: SendEmailResponse
      try {
        sesResult = await ses.sendEmail(params).promise()
      } catch (e) {
        console.log(e)
        throw new EmailSendException()
      }
    } else if (config.mailProvider === "SMTP" || STAGE == "test") {
      try {
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
                  pass: process.env.MAIL_PASSWORD,
                },
        })

        let info = await transporter.sendMail({
          from: `"Helpdesk" <${VER_SENDER}>`, // sender address
          to: recipient, // list of receivers
          subject: subject, // Subject line
          text: message, // plain text body
          html: message, // html body
        })
      } catch (e) {
        console.log(e)
        throw new EmailSendException()
      }
    } else if (config.mailProvider === "REST") {
      const result = await axios({
        method: config.restMailClientConfig.method,
        url: config.restMailClientConfig.url,
        data: config.restMailClientConfig.body
          ? JSON.parse(config.restMailClientConfig.body)
          : null,
        headers: config.restMailClientConfig.headers
          ? config.restMailClientConfig.headers
          : null,
      })
      console.log(result)
      if (result.statusText !== "OK") {
        throw new EmailSendException()
      }
    } else {
      throw new UnkownEmailServiceException()
    }
  }
}
