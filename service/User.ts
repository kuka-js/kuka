import User from "../entities/User"
import Scope from "../entities/Scope"
import { Connection } from "typeorm"
import ProjectConnection from "./Connection"
import { hashSync, compareSync } from "bcrypt"
import { sign, decode } from "jsonwebtoken"
import PasswordReset from "../entities/PasswordReset"
import RefreshTokenService from "./RefreshTokenService"
import Lock from "../entities/Lock"
import { v4 as uuid } from "uuid"
import { UserModel } from "../models/UserModel"
import {
  CreateDBAdapter,
  DatabaseImpl,
  convert,
} from "./Database/DatabaseFactory"
import { CreateUserResponse } from "./Database/Responses"
import { LoginUserResponse } from "./Responses/LoginUserResponse"
import { DBConnectionException } from "../exceptions/DBConncetionException"
import { UserDoesNotExistException } from "../exceptions/UserDoesNotExistException"
import { PasswordResetModel } from "../models/PasswordResetModel"
import VerificationService from "./Verification"
import { RenewJWTModel } from "../models/RenewJWTModel"
import * as logg from "loglevel"

const log = logg.getLogger("User")
log.setLevel("debug")

export default class UserService {
  async changePassword(passwordResetId, password1, password2) {
    if (!this.passwordStrengthCheck(password1)) {
      return {
        ok: 0,
        data: {
          error: "Password is too weak",
          message: "Password is too weak",
        },
      }
    }
    if (password1 != password2) {
      return { ok: 0, data: { message: "Passwords do not match!" } }
    }

    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      const passwordResetModel: PasswordResetModel = await DBImpl.getPasswordReset(
        passwordResetId
      )
      const createdDate: Date = new Date(passwordResetModel.creationDate)
      const now: Date = new Date()
      const diffTime: number = Math.abs(createdDate.getTime() - now.getTime())
      const diffDays: number = diffTime / (1000 * 60 * 60 * 24)
      if (diffDays > 1) {
        return { ok: 0, data: { message: "Password reset link expired" } }
      }
      const username: string = passwordResetModel.username
      const passwordHash = hashSync(password1, 10)
      await DBImpl.updatePasswordHash(username, passwordHash)
      return { ok: 1, data: { message: "Password successfully changed" } }
    } catch (e) {
      throw e
    }
  }

  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<SaveUserResponse> {
    if (!this.passwordStrengthCheck(password)) {
      return {
        ok: 0,
        data: {
          error: "Password is too weak",
          username,
          message: "Password is too weak",
        },
      }
    }
    const passwordHash: string = hashSync(password, 10)
    const userId: string = uuid()
    let emailVerified
    if (process.env.AUTO_VERIFY_MAIL) {
      emailVerified = true
    } else {
      emailVerified = false
    }
    let userModel: UserModel = {
      passwordHash,
      username,
      email,
      emailVerified,
      userId,
      scopes: ["default", "root"],
    }

    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    const existsBool = await DBImpl.userExists(username)
    if (existsBool) {
      return {
        ok: 0,
        data: {
          username,
          message: "Username taken",
        },
      }
    }
    console.log("Creating user")
    log.debug("Creating user")
    const createUserResponse: CreateUserResponse = await DBImpl.createUser(
      userModel
    )

    log.debug("Create verification link")
    await VerificationService.createVerificationLink({
      email,
      username,
    })

    const createUserAPIResponse: SaveUserResponse = {
      ok: createUserResponse.ok,
      data: {
        userId,
        username,
        error: createUserResponse.data.error,
        message: createUserResponse.data.message,
      },
    }

    return createUserAPIResponse
  }

  async loginUser(
    username: string,
    password: string
  ): Promise<LoginUserResponse> {
    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      const user: UserModel = await DBImpl.getUser(username)
      if (!user.emailVerified) {
        return {
          ok: 0,
          data: {
            error: "Email not verified.",
            username,
            message: "Email not verified.",
          },
        }
      }
      if (user.lockId) {
        return {
          ok: 0,
          data: {
            error: "User is locked.",
            username,
            message: "User is locked.",
          },
        }
      }
      if (compareSync(password, user.passwordHash)) {
        const token: string = sign(
          {
            username,
            scopes: user.scopes,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.EXPIRATION_TIME }
        )

        const { exp } = decode(token) as {
          [key: string]: number
        }
        const refreshTokenString: string = RefreshTokenService.generateRefreshToken()
        DBImpl.updateRefreshToken(username, refreshTokenString)
        return {
          ok: 1,
          data: {
            username,
            message: "Login successful.",
            refreshToken: refreshTokenString,
            token,
            expiry: exp,
          },
        }
      } else {
        return {
          ok: 0,
          data: {
            error: "Login failed.",
            username,
            message: "Login failed.",
          },
        }
      }
    } catch (e) {
      if (e instanceof DBConnectionException) {
        return {
          ok: 0,
          data: {
            message: "DB connection error",
            error: "DB connection error",
          },
        }
      } else if (e instanceof UserDoesNotExistException) {
        return {
          ok: 0,
          data: { message: "User not found", error: "User not found" },
        }
      } else if (e instanceof Error) {
        throw e
      } else {
        throw e
      }
    }
  }

  static async renewJWTToken(username: string): Promise<RenewJWTModel> {
    console.log("renewJWT username: " + username)
    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      const scopes: string[] = await DBImpl.getScopes(username)
      const token: string = sign(
        {
          username,
          scopes,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXPIRATION_TIME }
      )

      const { exp } = decode(token) as {
        [key: string]: number
      }

      return {
        username,
        message: "JWT renewed succesfully.",
        token,
        expiry: exp,
      }
    } catch (e) {
      console.log("renewJWT failLLLLLLLLLLL")
      throw new Error()
    }
  }

  async emailToUsername(email: string): Promise<string> {
    try {
      const DBImpl: DatabaseImpl = CreateDBAdapter(
        convert(process.env.DB_PROVIDER)
      )
      const username = await DBImpl.emailToUsername(email)
      return username
    } catch (e) {
      throw e
    }
  }

  async getUserList(): Promise<UserObject[]> {
    try {
      const DBImpl: DatabaseImpl = CreateDBAdapter(
        convert(process.env.DB_PROVIDER)
      )
      const userList: UserObject[] = await DBImpl.getUserList()
      return userList
    } catch (e) {
      throw e
    }
  }

  async getUser(username: string): Promise<UserObject | null> {
    try {
      const DBImpl: DatabaseImpl = CreateDBAdapter(
        convert(process.env.DB_PROVIDER)
      )
      const user: UserObject = await DBImpl.getUser(username)
      return user
    } catch (e) {
      throw e
    }
  }

  async deleteUser(username: string): Promise<boolean> {
    try {
      const DBImpl: DatabaseImpl = CreateDBAdapter(
        convert(process.env.DB_PROVIDER)
      )
      await DBImpl.deleteUser(username)
      return true
    } catch (e) {
      return false
    }
  }

  async lockUser(
    username: string,
    lockedBy: string,
    reason: string | null
  ): Promise<boolean> {
    try {
      const DBImpl: DatabaseImpl = CreateDBAdapter(
        convert(process.env.DB_PROVIDER)
      )
      await DBImpl.lockUser(username, lockedBy, reason)
      return true
    } catch (e) {
      return false
    }
  }

  private passwordStrengthCheck(password: string): boolean {
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    )
    if (strongRegex.test(password)) {
      return true
    } else {
      return false
    }
  }
}

interface SaveUserResponse {
  ok: number
  data: {
    userId?: string
    error?: string
    username: string
    message: string
  }
}

export interface UserObject {
  userId?: string
  username: string
  scopes: string[]
  isLocked?: string
}
