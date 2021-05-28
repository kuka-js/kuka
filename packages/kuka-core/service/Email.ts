import { SES, AWSError } from "aws-sdk"
import { SendEmailRequest, SendEmailResponse } from "aws-sdk/clients/ses"
import * as nodemailer from "nodemailer"
import { EmailSendException } from "../exceptions/EmailSendException"
import { UnkownEmailServiceException } from "../exceptions/UnknownEmailServiceException"
import { PlugLoad } from "plugload"

const provider = new PlugLoad("pluginloader", "../plugins")
const defaultMailProviders = ["AWSSES", "SMTP"]
interface EmailPlugin {
  pluginName: string
  pluginType: string
  sendEmail(
    email: string,
    sender: string,
    subject: string,
    message: string
  ): Promise<void>
}
interface KukaConfig {
  mailProvider: string
  plugins: string[]
}
    const config = provider.config as KukaConfig
export default class Email {
  async sendEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    // TODO refactor and make it so that you mail plugins abide by settings
    const STAGE = process.env.STAGE
    const VER_RECIPIENT = process.env.VER_RECIPIENT
    const VER_SENDER = process.env.VER_SENDER
    const recipient: string =
      STAGE == "development" || STAGE == "test" || STAGE == "local"
        ? VER_RECIPIENT
        : email

    if (defaultMailProviders.indexOf(config.mailProvider) === -1) {
      await provider.getPlugins()
      for (let plugin of provider.loadedPlugins) {
        const initPlugin = new plugin()
        if (initPlugin.pluginName == config.mailProvider) {
          const castPlugin = initPlugin as EmailPlugin
          const sender: string = VER_SENDER
          await castPlugin.sendEmail(recipient, sender, subject, message)
        }
      }
      return
    }
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
    } else if (config.mailProvider === "SMTP") {
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
    } else {
      throw new UnkownEmailServiceException()
    }
  }
}
