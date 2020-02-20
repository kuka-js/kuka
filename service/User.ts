import User from "../entities/User"
import Scope from "../entities/Scope"
import {Connection} from "typeorm"
import ProjectConnection from "./Connection"
import {hashSync, compareSync} from "bcrypt"
import {sign, decode} from "jsonwebtoken"
import VerificationService from "./Verification"
import PasswordReset from "../entities/PasswordReset"
import {OurMailResponse} from "./Email"
import RefreshTokenService from "./RefreshTokenService"

export default class UserService {
  async changePassword(passwordResetId, password1, password2) {
    if (!this.passwordStrengthCheck(password1)) {
      return {
        ok: 0,
        data: {
          error: "Password is too weak",
          message: "Password is too weak"
        }
      }
    }
    if (password1 != password2) {
      return {ok: 0, data: {message: "Passwords do not match!"}}
    }
    let connection: Connection = await ProjectConnection.connect()
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

  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<saveUserResponse> {
    if (!this.passwordStrengthCheck(password)) {
      return {
        ok: 0,
        data: {
          error: "Password is too weak",
          username,
          message: "Password is too weak"
        }
      }
    }
    try {
      let connection: Connection = await ProjectConnection.connect()
      if (connection) {
        const findCount: [User[], number] = await User.findAndCount()
        const userCount: number = findCount[1]
        let firstUser: boolean
        if (!userCount || userCount == 0) {
          firstUser = true
        } else {
          firstUser = false
        }
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
        const defaultScope: Scope = new Scope()
        defaultScope.scope = "default"
        await Scope.save(defaultScope)
        user.scopes = [defaultScope]
        // Give the first user created root scope
        if (firstUser) {
          const rootScope: Scope = new Scope()
          rootScope.scope = "root"
          await Scope.save(rootScope)
          user.scopes.push(rootScope)
        }
        const userResponse: User = await User.save(user)
        const verificationLinkResult: OurMailResponse = await VerificationService.createVerificationLink(
          email
        )
        if (verificationLinkResult.ok == 0) {
          return {
            ok: 0,
            data: {username, message: "createVerificationLink failed"}
          }
        } else {
          return {
            ok: 1,
            data: {
              userId: userResponse.id,
              username,
              message: "User successfully created!"
            }
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
    let connection: Connection = await ProjectConnection.connect()
    if (connection) {
      const findUser: User = await User.findOne({username})
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
    let connection: Connection = await ProjectConnection.connect()
    if (connection) {
      const user: User = await User.findOne({username}, {relations: ["scopes"]})
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
        const scopeArray: Scope[] = user.scopes
        const scopes: string[] = scopeArray.map(item => {
          return item.scope
        })
        const userId: number = user.id
        const token: string = sign(
          {
            userId,
            username,
            scopes
          },
          process.env.JWT_SECRET,
          {expiresIn: process.env.EXPIRATION_TIME}
        )

        const {exp} = decode(token) as {
          [key: string]: number
        }

        // Save refresh token to db
        const refreshTokenString: string = RefreshTokenService.generateRefreshToken()
        user.refreshToken = refreshTokenString
        await User.save(user)

        return {
          ok: 1,
          data: {
            username,
            message: "Login successful.",
            token,
            expiry: exp
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

  static async renewJWTToken(userId: number) {
    let connection: Connection = await ProjectConnection.connect()
    if (connection) {
      const user: User = await User.findOne(
        {id: userId},
        {relations: ["scopes"]}
      )
      if (!user) {
        return {
          ok: 0,
          data: {
            error: "User doesn't exist.",
            userId,
            message: "User doesn't exist."
          }
        }
      }

      const scopeArray: Scope[] = user.scopes
      const scopes: string[] = scopeArray.map(item => {
        return item.scope
      })
      const username = user.username
      const token: string = sign(
        {
          userId,
          username,
          scopes
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.EXPIRATION_TIME}
      )

      const {exp} = decode(token) as {
        [key: string]: number
      }

      return {
        ok: 1,
        data: {
          userId,
          username,
          message: "JWT renewed succesfully.",
          token,
          expiry: exp
        }
      }
    } else {
      throw "Connection problem"
    }
  }
  async emailToUserId(email: string): Promise<number> {
    let connection: Connection = await ProjectConnection.connect()
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

  async getUserList(): Promise<getUserListResponse[]> {
    let connection: Connection = await ProjectConnection.connect()
    if (connection) {
      const users: User[] = await User.find({relations: ["scopes"]})
      const userList: getUserListResponse[] = users.map(item => {
        const userId: number = item.id
        const username: string = item.username
        const scopes: string[] = item.scopes.map(scope => {
          return scope.scope
        })
        const user: getUserListResponse = {
          userId,
          username,
          scopes
        }
        return user
      })
      return userList
    } else {
      throw "Connection problem"
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    let connection: Connection = await ProjectConnection.connect()
    if (connection) {
      const user: User = await User.findOne({id})
      if (!user) {
        return false
      }
      const userRemoveResponse: User = await User.remove(user)
      if (userRemoveResponse) {
        return true
      } else {
        return false
      }
    } else {
      throw "Connection problem"
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

interface saveUserResponse {
  ok: number
  data: {
    userId?: number
    error?: string
    username: string
    message: string
  }
}

export interface getUserListResponse {
  userId: number
  username: string
  scopes: string[]
}
