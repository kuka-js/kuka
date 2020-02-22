import {APIGatewayEvent, Context, Handler, Callback} from "aws-lambda"
import RegisterResponse from "./responses/RegisterResponse"
import UserService from "./service/User"
import LoginResponse from "./responses/LoginResponse"
import BaseResponse from "./responses/BaseResponse"
import VerificationService from "./service/Verification"
import PasswordResetService from "./service/Reset"
import ScopeService from "./service/Scope"
import ResetResponse from "./responses/ResetResponse"
import ScopeResponse from "./responses/ScopeResponse"
import UserListResponse from "./responses/UserListResponse"
import RefreshTokenService, {
  CookieFromHeader
} from "./service/RefreshTokenService"
import BaseErrorResponse from "./responses/BaseErrorResponse"

export const register: Handler = async (event: APIGatewayEvent) => {
  if (event.body != null) {
    try {
      JSON.parse(event.body)
    } catch (e) {
      return new RegisterResponse(500, 0, "JSON invalid").response()
    }
    const {username, email, password} = JSON.parse(event.body)
    const userService = new UserService()
    const {ok, data} = await userService.registerUser(username, email, password)

    if (ok == 0) {
      return new RegisterResponse(500, 0, data.message).response()
    } else {
      return new RegisterResponse(201, 1, data.message, data.userId).response()
    }
  } else {
    return new RegisterResponse(400, 0, "No body sent").response()
  }
}

export const login: Handler = async (event: APIGatewayEvent) => {
  if (event.body != null) {
    const {username, password} = JSON.parse(event.body)
    const userService = new UserService()
    const {ok, data} = await userService.loginUser(username, password)
    if (ok == 0) {
      return new LoginResponse(400, 0, data.message).response()
    } else {
      return new LoginResponse(
        200,
        1,
        data.message,
        data.token,
        data.expiry,
        data.refreshToken
      ).response()
    }
  } else {
    return new LoginResponse(400, 0, "No body sent").response()
  }
}

export const verify: Handler = async (event: APIGatewayEvent) => {
  const {id} = event.pathParameters
  const verification = new VerificationService()
  if (await verification.markEmailVerified(id)) {
    return new BaseResponse(200, 1, `Email verified`).response()
  } else {
    return new BaseResponse(500, 0, `Unable to verify email`).response()
  }
}

export const reset: Handler = async (event: APIGatewayEvent) => {
  if (event.body != null) {
    const {email} = JSON.parse(event.body)

    const passwordReset = new PasswordResetService()

    let passwordResetResult: string
    if (process.env.AUTO_SEND_PASSWORD_RESET_ID) {
      passwordResetResult = await passwordReset.createPasswordResetLink(
        email,
        true
      )
    } else {
      passwordResetResult = await passwordReset.createPasswordResetLink(
        email,
        false
      )
    }

    if (passwordResetResult == "true") {
      return new BaseResponse(200, 1, `Password Reset email sent`).response()
    } else if (passwordResetResult == "false") {
      return new BaseResponse(
        500,
        0,
        `Unable to send password reset email`
      ).response()
    } else {
      // If passwordResetResult return resetId
      return new ResetResponse(
        200,
        1,
        `Returning resetId`,
        passwordResetResult
      ).response()
    }
  }
}

export const password: Handler = async (event: APIGatewayEvent) => {
  if (event.body != null) {
    const {passwordResetId, password1, password2} = JSON.parse(event.body)

    const user = new UserService()
    const changePasswordResult = await user.changePassword(
      passwordResetId,
      password1,
      password2
    )

    if (changePasswordResult.ok == 0) {
      return new BaseResponse(
        500,
        0,
        changePasswordResult.data.message
      ).response()
    }

    return new BaseResponse(200, 1, `Password reset succesfully`).response()
  }
}

export const addScope: Handler = async (event: APIGatewayEvent) => {
  const {id} = event.pathParameters
  if (event.body != null) {
    const body = JSON.parse(event.body)
    const newScope = body.scope
    const scopes = new ScopeService()
    const scopeResponse = await scopes.addScope(parseInt(id), newScope)
    if (scopeResponse) {
      return new BaseResponse(200, 1, `Scope added succesfully`).response()
    } else {
      return new BaseResponse(500, 0, "Failed to add scope").response()
    }
  }
}

export const removeScope: Handler = async (event: APIGatewayEvent) => {
  const {id, scopeName} = event.pathParameters
  const scopes = new ScopeService()
  const scopeResponse = await scopes.removeScope(parseInt(id), scopeName)
  if (scopeResponse) {
    return new BaseResponse(200, 1, `Scope removed succesfully`).response()
  } else {
    return new BaseResponse(500, 0, "Failed to remove scope").response()
  }
}

export const getScopes: Handler = async (event: APIGatewayEvent) => {
  const {id} = event.pathParameters
  const scopes = new ScopeService()
  const scopeResponse = await scopes.getScopes(parseInt(id))
  if (Array.isArray(scopeResponse)) {
    return new ScopeResponse(200, 1, `Your scopes`, scopeResponse).response()
  } else {
    return new BaseResponse(500, 0, "Something went wrong").response()
  }
}

export const getUserList: Handler = async (event: APIGatewayEvent) => {
  const users = new UserService()
  const userResponse = await users.getUserList()
  if (Array.isArray(userResponse)) {
    return new UserListResponse(200, 1, "The userlist", userResponse).response()
  } else {
    return new BaseResponse(500, 0, "Connection error").response()
  }
}

export const refreshToken: Handler = async (event: APIGatewayEvent) => {
  const id = parseInt(event.pathParameters.id)
  console.log(event.headers)
  console.log(event.multiValueHeaders)
  const cookie = RefreshTokenService.getCookiesFromHeader(
    event.headers
  ) as CookieFromHeader
  const {RefreshToken} = cookie

  const tokenResponse = await RefreshTokenService.refreshToken(id, RefreshToken)
  const renewJWTResponse = await UserService.renewJWTToken(id)
  if (tokenResponse.ok == 1 && renewJWTResponse.ok == 1) {
    return new LoginResponse(
      200,
      1,
      "JWT renewed succesfully",
      renewJWTResponse.data.token,
      renewJWTResponse.data.expiry,
      tokenResponse.refreshToken
    ).response()
  } else {
    return new BaseErrorResponse("Could not renew refresh token").response()
  }
}

export const deleteUser: Handler = async (event: APIGatewayEvent) => {
  const {id} = event.pathParameters
  const user = new UserService()
  const userResponse: boolean = await user.deleteUser(parseInt(id))
  if (userResponse) {
    return new BaseResponse(200, 1, `Removed user by id ${id}`).response()
  } else {
    return new BaseResponse(500, 0, "Something went wrong").response()
  }
}

export const lockUser: Handler = async (event: APIGatewayEvent) => {
  const {userid} = event.pathParameters
  const lockedBy = event.requestContext.authorizer.principalId
  let reason: string | null
  if (event.body != null) {
    const body = JSON.parse(event.body)
    reason = body.reason
  }
  const user = new UserService()
  const lockResponse: boolean = await user.lockUser(
    parseInt(userid),
    lockedBy,
    reason
  )
  if (lockResponse) {
    return new BaseResponse(200, 1, `User ${userid} locked `).response()
  } else {
    return new BaseResponse(500, 0, "Failed to lock user").response()
  }
}
