import {v4 as uuid} from "uuid"
import User from "../entities/User"
import UserService from "./User"
import {Connection} from "typeorm"
import ProjectConnection from "./Connection"
import Email from "./Email"
import PasswordReset from "../entities/PasswordReset"

export default class PasswordResetService {
  async markPasswordResetDone(passwordResetId: string): Promise<boolean> {
    try {
      let connection: Connection = await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return false
    }

    try {
      const passwordReset: PasswordReset = await PasswordReset.findOne({
        passwordResetId
      })
      passwordReset.clicked = true
      let {userId} = passwordReset
      await PasswordReset.save(passwordReset)
      const user = await User.findOne({id: userId})
      user.emailVerified = true
      await User.save(user)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async createPasswordResetLink(
    email: string,
    return_id: boolean
  ): Promise<string> {
    try {
      let connection: Connection = await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return "false"
    }
    const passwordResetId = uuid()

    let passwordReset = new PasswordReset()
    let userController = new UserService()

    passwordReset.userId = await userController.emailToUserId(email)
    passwordReset.passwordResetId = passwordResetId
    passwordReset.email = email
    passwordReset.clicked = false
    try {
      await PasswordReset.save(passwordReset)
      passwordReset.save()
      const PW_RESET_LINK_PAGE = process.env.PW_RESET_LINK_PAGE

      if (return_id) {
        return passwordResetId
      } else {
        const emailInstance = new Email()
        await emailInstance.sendEmail(
          email,
          "Reset your password",
          `You can reset your password from this link: ${PW_RESET_LINK_PAGE}/${passwordResetId}`,
          process.env.EMAIL_SERVICE
        )
        return "true"
      }
    } catch (e) {
      console.log(e)
      return "false"
    }
  }
}
