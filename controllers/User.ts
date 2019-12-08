import User from "../entities/User"
// import {createConnection, getConnectionManager, Connection} from "typeorm"
import {Connection} from "typeorm"
import ProjectConnection from "../service/connection"
import {hashSync, compareSync} from "bcrypt"
import UserExistsException from "../exceptions/UserExistsException"

import {sign} from "jsonwebtoken"
import VerificationController from "./verification"

export default class UserController {
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
        user.emailVerified = false
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
