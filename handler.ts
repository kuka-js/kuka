import {APIGatewayEvent, Context, Handler, Callback} from "aws-lambda"
import RegisterResponse from "./responses/RegisterResponse"
import UserController from "./controllers/user"
import LoginResponse from "./responses/LoginResponse"
import HiddenResponse from "./responses/HiddenResponse"
import BaseResponse from "./responses/BaseResponse"
import VerificationController from "./controllers/verification"
import PasswordResetController from "./controllers/reset"
import ResetResponse from "./responses/ResetResponse"

export const register: Handler = async (event: APIGatewayEvent) => {
  if (event.body != null) {
    try {
      JSON.parse(event.body)
    } catch (e) {
      return new RegisterResponse(500, 0, "JSON invalid").response()
    }
    const {username, email, password} = JSON.parse(event.body)
    const userController = new UserController()
    const {ok, data} = await userController.saveUser(username, email, password)

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
    const userController = new UserController()
    const {ok, data} = await userController.loginUser(username, password)
    if (ok == 0) {
      return new LoginResponse(400, 0, data.message).response()
    } else {
      return new LoginResponse(200, 1, data.message, data.token).response()
    }
  } else {
    return new LoginResponse(400, 0, "No body sent").response()
  }
}

export const verify: Handler = async (event: APIGatewayEvent) => {
  const {id} = event.pathParameters
  const verification = new VerificationController()
  if (await verification.markEmailVerified(id)) {
    return new BaseResponse(200, 1, `Email verified`).response()
  } else {
    return new BaseResponse(500, 0, `Unable to verify email`).response()
  }
}

export const reset: Handler = async (event: APIGatewayEvent) => {
  if (event.body != null) {
    const {email} = JSON.parse(event.body)

    const passwordReset = new PasswordResetController()

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

    const user = new UserController()
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

export const hidden: Handler = async (event: APIGatewayEvent) => {
  const username = event.requestContext.authorizer.principalId
  return new HiddenResponse(200, 1, `Hello, ${username}`).response()
}
