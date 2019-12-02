import User from "../Entities/User"
import {createConnection, getConnectionManager, Connection} from "typeorm"
import {hashSync, compareSync} from "bcrypt"
import UserExistsException from "../exceptions/UserExistsException"
import {SES, AWSError} from "aws-sdk"
import {SendEmailRequest, SendEmailResponse} from "aws-sdk/clients/ses"
import {sign} from "jsonwebtoken"
export default class UserController {
  async saveUser(
    username: string,
    password: string
  ): Promise<saveUserResponse> {
    try {
      let connection: Connection
      try {
        connection = await createConnection()
      } catch (err) {
        // If AlreadyHasActiveConnectionError occurs, return already existent connection
        if (err.name === "AlreadyHasActiveConnectionError") {
          connection = getConnectionManager().get("default")
        } else {
          throw "Cant get active connection"
        }
      }
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
        user.emailVerified = false
        user.userType = "regular"
        const userResponse: User = await User.save(user)
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
    let connection: Connection
    try {
      connection = await createConnection()
    } catch (err) {
      // If AlreadyHasActiveConnectionError occurs, return already existent connection
      if (err.name === "AlreadyHasActiveConnectionError") {
        connection = getConnectionManager().get("default")
      } else {
        throw "Cant get active connection"
      }
    }
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
    let connection: Connection
    try {
      connection = await createConnection()
    } catch (err) {
      // If AlreadyHasActiveConnectionError occurs, return already existent connection
      if (err.name === "AlreadyHasActiveConnectionError") {
        connection = getConnectionManager().get("default")
      } else {
        throw "Cant get active connection"
      }
    }
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
        const token = sign(
          {
            data: "foobar"
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

  async sendVerificationMail(email: string): Promise<boolean> {
    const ses = new SES({region: "eu-central-1"})

    const sender: string = "nake89@gmail.com"
    const recipient: string = "maiju.kirppu@gmail.com"
    const subject: string = "The subject"
    const charset: string = "UTF-8"
    const body: string = "Well well above excellence"
    const html: string = "Well well above excellence"

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
    let sesResult: SES.SendEmailResponse
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

interface saveUserResponse {
  ok: number
  data: {
    userId?: number
    error?: string
    username: string
    message: string
  }
}
