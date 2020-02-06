import {v4 as uuid} from "uuid"
import Verification from "../entities/Verification"
import User from "../entities/User"
import UserController from "./User"
import {Connection} from "typeorm"
import ProjectConnection from "../service/connection"
import Email from "../service/email"

export default class VerificationController {
  async markEmailVerified(verifyLinkId: string): Promise<boolean> {
    try {
      let connection: Connection = await ProjectConnection.connect()
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

  public static async createVerificationLink(email: string): Promise<boolean> {
    try {
      let connection: Connection = await ProjectConnection.connect()
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
      const BASE_URL = process.env.BASE_URL
      const emailInstance = new Email()
      if (
        process.env.STAGE != "test" ||
        process.env.AUTO_VERIFY_MAIL != "true"
      ) {
        await emailInstance.sendEmail(
          email,
          "Verify your email address",
          `Please verify your email address by clicking this link: https://${BASE_URL}/user/verify/${verificationId}`
        )
      }
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
