import {APIGatewayEvent, Context, Handler, Callback} from "aws-lambda"
import RegisterResponse from "./responses/RegisterResponse"
import UserController from "./controllers/user"
import LoginResponse from "./responses/LoginResponse"
import HiddenResponse from "./responses/HiddenResponse"
import BaseResponse from "./responses/BaseResponse"
import VerificationController from "./controllers/verification"

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
  if (event.body != null) {
    const {verificationId} = JSON.parse(event.body)
    const verification = new VerificationController()
    if (verification.markEmailVerified(verificationId)) {
      return new BaseResponse(200, 1, `Email verified`).response()
    } else {
      return new BaseResponse(500, 0, `Unable to verify email`).response()
    }
  }
}

export const reset: Handler = async (event: APIGatewayEvent) => {
  // if (event.body != null) {
  //   const {email} = JSON.parse(event.body)
  //   const verificationController = new VerificationController()
  //   verificationController.createVerificationLink(5, email)
  //   // Create email verification link.
  //   const userController = new UserController()
  //   if (await userController.sendVerificationMail(email)) {
  //     return new BaseResponse(200, 1, "Email send success").response()
  //   } else {
  //     return new BaseResponse(400, 0, "Email send fail").response()
  //   }
  // }
}

export const hidden: Handler = async (event: APIGatewayEvent) => {
  const username = event.requestContext.authorizer.principalId
  return new HiddenResponse(200, 1, `Hello, ${username}`).response()
}
