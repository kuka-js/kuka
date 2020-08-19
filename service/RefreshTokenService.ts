import ProjectConnection from "./Connection"
import User from "../entities/User"
import { v4 as uuid } from "uuid"
import {
  CreateDBAdapter,
  DatabaseImpl,
  convert,
} from "./Database/DatabaseFactory"

export default class RefreshTokenService {
  public static async refreshToken(
    username: string,
    oldRefreshToken: string
  ): Promise<RefreshTokenServiceResponse> {
    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      const refreshToken = await DBImpl.getRefreshToken(username)

      if (this.compareRefreshTokens(oldRefreshToken, refreshToken)) {
        const newRefreshToken = this.generateRefreshToken()
        await DBImpl.updateRefreshToken(username, newRefreshToken)
        return { ok: 1, refreshToken: newRefreshToken }
      } else {
        return {
          ok: 0,
          errorCode: RefreshTokenServiceError.REFRESH_TOKEN_INVALID,
          errorMessage: "Given refresh token does not match",
        }
      }
    } catch (e) {
      console.log(e)
      return {
        ok: 0,
        errorCode: RefreshTokenServiceError.CONNECTION_PROBLEM,
        errorMessage: "Connection problem",
      }
    }
  }

  public static compareRefreshTokens(
    oldRefreshToken: string,
    newRefreshToken: string
  ): boolean {
    if (oldRefreshToken == newRefreshToken) {
      return true
    } else {
      return false
    }
  }

  public static generateRefreshToken(): string {
    return uuid()
  }

  public static getCookiesFromHeader(headers) {
    if (
      headers === null ||
      headers === undefined ||
      headers.Cookie === undefined
    ) {
      return {}
    }

    // Split a cookie string in an array (Originally found http://stackoverflow.com/a/3409200/1427439)
    var list = {},
      rc = headers.Cookie

    rc &&
      rc.split(";").forEach(function (cookie) {
        var parts = cookie.split("=")
        var key = parts.shift().trim()
        var value = decodeURI(parts.join("="))
        if (key != "") {
          list[key] = value
        }
      })

    return list
  }
}

export interface RefreshTokenServiceResponse {
  ok: number
  errorCode?: RefreshTokenServiceError
  errorMessage?: string
  refreshToken?: string
}

export enum RefreshTokenServiceError {
  CONNECTION_PROBLEM,
  REFRESH_TOKEN_INVALID,
}

export interface CookieFromHeader {
  domain: string
  HttpOnly: string
  path: string
  RefreshToken: string
}
