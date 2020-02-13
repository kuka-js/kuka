import {v4 as uuid} from "uuid"
import Verification from "../entities/Verification"
import User from "../entities/User"
import UserService from "./User"
import ProjectConnection from "./Connection"
import Email, {OurMailResponse} from "./Email"

export default class VerificationService {
  async markEmailVerified(verifyLinkId: string): Promise<boolean> {
    try {
      await ProjectConnection.connect()
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

  public static async createVerificationLink(
    email: string
  ): Promise<OurMailResponse> {
    try {
      await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return {ok: 0, error: "createVerificationLink db connection problem"}
    }
    const verificationId = uuid()

    let verification = new Verification()
    let userService = new UserService()

    verification.userId = await userService.emailToUserId(email)
    verification.verifyLinkId = verificationId
    verification.email = email
    verification.clicked = false
    try {
      await Verification.save(verification)
      if (
        process.env.STAGE == "test" ||
        process.env.AUTO_VERIFY_MAIL == "true"
      ) {
        return {ok: 1}
      } else {
        const emailInstance = new Email()
        return await emailInstance.sendEmail(
          email,
          "Verify your email address",
          `Please verify your email address by clicking this link: ${process.env.VERIFICATION_LINK_URL}${verificationId}`,
          process.env.EMAIL_SERVICE
        )
      }
    } catch (e) {
      console.log(e)

      return {
        ok: 0,
        error:
          "Problem saving verification id or sending verification email mail"
      }
    }
  }
}
