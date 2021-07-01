import { v4 as uuid } from "uuid"
import Email from "./Email"
import { CreateVerificationLinkRequest } from "./Requests/CreateVerificationLinkRequest"
import {
  CreateDBAdapter,
  DatabaseImpl,
  convert,
} from "./Database/DatabaseFactory"

export default class VerificationService {
  async markEmailVerified(verifyLinkId: string): Promise<void> {
    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      DBImpl.markEmailVerified(verifyLinkId)
    } catch (e) {
      // throws DBConnectionException
      throw e
    }
  }

  public static async createVerificationLink(
    request: CreateVerificationLinkRequest
  ): Promise<void> {
    const { email, username } = request
    const verifyLinkId = uuid()
    let clicked
    if (process.env.AUTO_VERIFY_MAIL == "true") {
      clicked = true
    } else {
      clicked = false
    }

    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      DBImpl.createVerificationLink({
        verifyLinkId,
        username,
        clicked,
      })
    } catch (e) {
      // throws DBConnectionException
      throw e
    }
    if (!(process.env.STAGE == "test")) {
      if (!(process.env.AUTO_VERIFY_MAIL == "true")) {
        try {
          const emailInstance = new Email()
          await emailInstance.sendEmail(
            email,
            "Verify your email address",
            `Please verify your email address by clicking this link: ${process.env.VERIFICATION_LINK_URL}${verifyLinkId}`
          )
        } catch (e) {
          // throws EmailSendException, UnkownEmailServiceException
          throw e
        }
      }
    }
  }
}
