import {v4 as uuid} from "uuid"
import Verification from "../entities/Verification"
import User from "../entities/User"
import {SES, AWSError} from "aws-sdk"
import {SendEmailRequest, SendEmailResponse} from "aws-sdk/clients/ses"
import UserController from "./user"
import {Connection} from "typeorm"
import ProjectConnection from "../service/connection"

export default class VerificationController {
  async markEmailVerified(verifyLinkId: string): Promise<boolean> {
    try {
      let connect = new ProjectConnection()
      let connection: Connection = await connect.connect()
    } catch (e) {
      console.log(e)
      return false
    }

    try {
      const verification: Verification = await Verification.findOne({
        verifyLinkId
      })
      verification.clicked = true
      let {userId} = verification
      await Verification.save(verification)
      const user = await User.findOne({id: userId})
      user.emailVerified = true
      await User.save(user)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async createVerificationLink(email: string): Promise<boolean> {
    try {
      let connect = new ProjectConnection()
      let connection: Connection = await connect.connect()
    } catch (e) {
      console.log(e)
      return false
    }
    const verificationId = uuid()

    let verification = new Verification()
    let userController = new UserController()

    verification.userId = await userController.emailToUserId(email)
    verification.verifyLinkId = verificationId
    verification.email = email
    verification.clicked = false
    try {
      await Verification.save(verification)
      verification.save()
      await this.sendVerificationMail(email, verificationId)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
  async sendVerificationMail(
    email: string,
    verificationId: string
  ): Promise<boolean> {
    const ses = new SES({region: "eu-central-1"})
    const VER_RECIPIENT = process.env.VER_RECIPIENT
    const VER_SENDER = process.env.VER_SENDER
    const STAGE = process.env.STAGE
    const sender: string = VER_SENDER
    const recipient: string =
      STAGE == "development" || STAGE == "local" ? VER_RECIPIENT : email
    const subject: string = "The subject"
    const charset: string = "UTF-8"
    const body: string = `Please verify your email address by clicking this link: ${verificationId}`
    const html: string = `Please verify your email address by clicking this link: ${verificationId}`

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
