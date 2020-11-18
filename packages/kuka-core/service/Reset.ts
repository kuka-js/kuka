import {v4 as uuid} from "uuid"
import User from "../entities/User"
import UserService from "./User"
import {Connection} from "typeorm"
import ProjectConnection from "./Connection"
import Email from "./Email"
import PasswordReset from "../entities/PasswordReset"
import {
  CreateDBAdapter,
  convert,
  DatabaseImpl
} from "./Database/DatabaseFactory"
import {PasswordResetModel} from "../models/PasswordResetModel"
import * as logg from "loglevel"

const log = logg.getLogger("PasswordResetService")
log.setLevel("debug")

export default class PasswordResetService {
  async markPasswordResetDone(passwordResetId: string): Promise<boolean> {
    try {
      await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return false
    }

    try {
      const passwordReset: PasswordReset = await PasswordReset.findOne({
        passwordResetId
      })
      passwordReset.clicked = true
      let {username: userId} = passwordReset
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

  async createPasswordResetLink(email: string): Promise<string> {
    const passwordResetId = uuid()
    try {
      const DBImpl: DatabaseImpl = CreateDBAdapter(
        convert(process.env.DB_PROVIDER)
      )
      const passwordResetModel: PasswordResetModel = {
        passwordResetId,
        email,
        clicked: false
      }
      log.debug(
        `Inserting password reset link details to DB for email ${email} `
      )
      DBImpl.createPasswordReset(passwordResetModel)
    } catch (e) {
      console.log(e)
      return "false"
    }

    try {
      const PW_RESET_LINK_PAGE = process.env.PW_RESET_LINK_PAGE
      if (process.env.AUTO_SEND_PASSWORD_RESET_ID === "true") {
        return passwordResetId
      } else {
        log.debug(`Sending password reset link to customer. ${email}`)
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
