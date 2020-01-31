import User from "../entities/User"
// import {createConnection, getConnectionManager, Connection} from "typeorm"
import {Connection} from "typeorm"
import ProjectConnection from "../service/connection"
import {hashSync, compareSync} from "bcrypt"
import UserExistsException from "../exceptions/UserExistsException"

import {sign} from "jsonwebtoken"
import VerificationController from "./verification"
import PasswordReset from "../entities/PasswordReset"

export default class UserController {
  async changePassword(passwordResetId, password1, password2) {
    if (password1 != password2) {
      return {ok: 0, data: {message: "Passwords do not match!"}}
    }
    let connect = new ProjectConnection()
    let connection: Connection = await connect.connect()
    if (connection) {
      const passwordReset: PasswordReset = await PasswordReset.findOne({
        passwordResetId
      })
      if (!passwordReset) {
        return {ok: 0}
      }
      const createdDate: Date = passwordReset.createdDate
      const now: Date = new Date()
      const diffTime: number = Math.abs(createdDate.getTime() - now.getTime())
      const diffDays: number = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays > 1) {
        return {ok: 0, data: {message: "Password reset link expired"}}
      }

      const userId: number = passwordReset.userId
      const user: User = await User.findOne({id: userId})
      if (!user) {
        return {
          ok: 0,
          data: {
            error: "User doesn't exist.",
            message: "User doesn't exist."
          }
        }
      } else {
        user.passwordHash = hashSync(password1, 10)
        try {
          await User.save(user)
          return {ok: 1, data: {message: "Password successfully changed"}}
        } catch (e) {
          console.log(e)
          return {
            ok: 0,
            data: {message: "Password change failed. DB issue. Check logs"}
          }
        }
      }
    }
  }
  async saveUser(
    username: string,
    email: string,
    password: string
  ): Promise<saveUserResponse> {
    try {
      let connect = new ProjectConnection()
      let connection: Connection = await connect.connect()
      if (connection) {
        if (await this.userExists(username)) {
          return {
            ok: 0,
            data: {
              error: "Couldn't create user. User exists",
              username,
              message: "Couldn't create user. User exists"
            }
          }
        }
        const hash: string = hashSync(password, 10)
        const user: User = new User()
        user.username = username
        user.passwordHash = hash
        user.email = email
        if (process.env.AUTO_VERIFY_MAIL) {
          user.emailVerified = true
        } else {
          user.emailVerified = false
        }
        user.userType = "regular"
        const userResponse: User = await User.save(user)
        const verificationController = new VerificationController()
        await verificationController.createVerificationLink(email)

        return {
          ok: 1,
          data: {
            userId: userResponse.id,
            username,
            message: "User successfully created!"
          }
        }
      } else {
        console.log(connection)
        return {
          ok: 0,
          data: {
            error: "Couldn't create user.",
            username,
            message: "Couldn't create user."
          }
        }
      }
    } catch (error) {
      console.log(error)
      return {
        ok: 0,
        data: {
          error,
          username,
          message: "Couldn't create user."
        }
      }
    }
  }

  async userExists(username: string): Promise<boolean> {
    let connect = new ProjectConnection()
    let connection: Connection = await connect.connect()
    if (connection) {
      const findUser: User = await User.findOne({username})
      console.log(findUser)
      if (findUser) {
        return true
      } else {
        return false
      }
    } else {
      throw "Connection problem"
    }
  }

  async loginUser(username: string, password: string) {
    let connect = new ProjectConnection()
    let connection: Connection = await connect.connect()
    if (connection) {
      const user: User = await User.findOne({username})
      if (!user) {
        return {
          ok: 0,
          data: {
            error: "User doesn't exist.",
            username,
            message: "User doesn't exist."
          }
        }
      }

      if (!user.emailVerified) {
        return {
          ok: 0,
          data: {
            error: "Email not verified.",
            username,
            message: "Email not verified."
          }
        }
      }
      if (compareSync(password, user.passwordHash)) {
        const token: string = sign(
          {
            data: "foobar",
            username
          },
          "secret",
          {expiresIn: "1h"}
        )
        return {
          ok: 1,
          data: {
            username,
            message: "Login successful.",
            token
          }
        }
      } else {
        return {
          ok: 0,
          data: {
            error: "Login failed.",
            username,
            message: "Login failed."
          }
        }
      }
    } else {
      throw "Connection problem"
    }
  }

  async emailToUserId(email: string): Promise<number> {
    let connect = new ProjectConnection()
    let connection: Connection = await connect.connect()
    if (connection) {
      const findUser: User = await User.findOne({email})
      if (findUser) {
        return findUser.id
      } else {
        throw "Cannot find user id. Email might not exist."
      }
    } else {
      throw "Connection problem"
    }
  }
}

interface saveUserResponse {
  ok: number
  data: {
    userId?: number
    error?: string
    username: string
    message: string
  }
}
