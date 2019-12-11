import {SES, AWSError} from "aws-sdk"
import {SendEmailRequest, SendEmailResponse} from "aws-sdk/clients/ses"

export default class Email {
  async sendEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    const ses = new SES({region: "eu-central-1"})
    const VER_RECIPIENT = process.env.VER_RECIPIENT
    const VER_SENDER = process.env.VER_SENDER
    const STAGE = process.env.STAGE
    const sender: string = VER_SENDER
    const recipient: string =
      STAGE == "development" || STAGE == "local" ? VER_RECIPIENT : email
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
      console.log(sesResult)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
