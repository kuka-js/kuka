import ProjectConnection from "./Connection"
import User from "../entities/User"
import RefreshToken from "../entities/RefreshToken"
import {v4 as uuid} from "uuid"

export default class RefreshTokenService {
  public static async refreshToken(
    userId,
    oldRefreshToken
  ): Promise<RefreshTokenServiceResponse> {
    try {
      await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return {
        ok: 0,
        errorCode: RefreshTokenServiceError.CONNECTION_PROBLEM,
        errorMessage: "Connection problem"
      }
    }
    const user: User = await User.findOne(
      {id: userId},
      {relations: ["refreshToken"]}
    )
    const refreshTokenFromDB: RefreshToken = user.refreshToken
    if (oldRefreshToken == refreshTokenFromDB.refreshToken) {
      return {ok: 1, refreshToken: this.generateRefreshToken()}
    } else {
      return {
        ok: 0,
        errorCode: RefreshTokenServiceError.REFRESH_TOKEN_INVALID,
        errorMessage: "Given refresh token does not match"
      }
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
      rc.split(";").forEach(function(cookie) {
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

interface RefreshTokenServiceResponse {
  ok: number
  errorCode?: RefreshTokenServiceError
  errorMessage?: string
  refreshToken?: string
}

enum RefreshTokenServiceError {
  CONNECTION_PROBLEM,
  REFRESH_TOKEN_INVALID
}

export interface CookieFromHeader {
  domain: string
  HttpOnly: string
  path: string
  RefreshToken: string
}
