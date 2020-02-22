require("reflect-metadata")
import UserService, {getUserResponse} from "../service/User"
require("dotenv").config({path: process.cwd() + "/.env.testing"})

describe("user tests", () => {
  beforeAll(() => {})

  it("registerUser_password_too_weak", async () => {
    const uc = new UserService()
    const registerUserResult = await uc.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa1"
    )

    expect(registerUserResult.ok).toBe(0)
    expect(registerUserResult.data.username).toBe("nake89@gmail.com")
    expect(registerUserResult.data.message).toBe("Password is too weak")
  })

  it("registerUser_success", async () => {
    const uc = new UserService()
    const registerUserResult = await uc.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa12aaaa3!!"
    )

    expect(registerUserResult.ok).toBe(1)
    expect(registerUserResult.data.userId).toBe(1)
    expect(registerUserResult.data.username).toBe("nake89@gmail.com")
    expect(registerUserResult.data.message).toBe("User successfully created!")
  })

  it("registerUser_user_already_exists", async () => {
    const uc = new UserService()
    const registerUserResult = await uc.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa12aaaa3!!"
    )
    expect(registerUserResult.ok).toBe(0)
    expect(registerUserResult.data.username).toBe("nake89@gmail.com")
    expect(registerUserResult.data.message).toBe(
      "Couldn't create user. User exists"
    )
  })

  it("registerAndloginUser_test", async () => {
    const uc = new UserService()
    const username = "nake89+new@gmail.com"
    const password = "asdaAa12aaaa3!!"
    const registerUserResult = await uc.registerUser(
      username,
      username,
      password
    )
    const loginUserResult = await uc.loginUser(username, password)
    expect(registerUserResult.ok).toBe(1)
    expect(registerUserResult.data.userId).toBe(2)
    expect(registerUserResult.data.username).toBe(username)
    expect(registerUserResult.data.message).toBe("User successfully created!")
    expect(loginUserResult.ok).toBe(1)
    expect(typeof loginUserResult.data.token).toBe("string")
    expect(Number.isInteger(loginUserResult.data.expiry)).toBe(true)
  })

  it("renewJWTToken_ExpectSuccess", async () => {
    const renewTokenResult = await UserService.renewJWTToken(1)
    expect(renewTokenResult.ok).toBe(1)
    expect(Number.isInteger(renewTokenResult.data.userId)).toBe(true)
    expect(typeof renewTokenResult.data.username === "string").toBe(true)
    expect(renewTokenResult.data.message).toBe("JWT renewed succesfully.")
    expect(typeof renewTokenResult.data.token === "string").toBe(true)
    expect(Number.isInteger(renewTokenResult.data.expiry)).toBe(true)
  })

  it("renewJWTToken_ExpectFailure", async () => {
    const userId = 10000
    const renewTokenResult = await UserService.renewJWTToken(userId)
    expect(renewTokenResult.ok).toBe(0)
    expect(Number.isInteger(renewTokenResult.data.userId)).toBe(true)
    expect(renewTokenResult.data.userId).toBe(userId)
    expect(renewTokenResult.data.error).toBe("User doesn't exist.")
  })

  it("getUserList_test", async () => {
    const us = new UserService()
    const userListResult: getUserResponse[] = await us.getUserList()
    expect(Array.isArray(userListResult)).toBe(true)
    expect(userListResult.length).toBe(2)
    expect(userListResult[0].userId).toBe(1)
    expect(userListResult[0].username).toBe("nake89@gmail.com")
    expect(userListResult[0].scopes.includes("root")).toBe(true)
  })

  it("getUser_ExpectSuccess", async () => {
    const us = new UserService()
    const userResponse: getUserResponse = (await us.getUser(
      1
    )) as getUserResponse
    expect(userResponse.userId).toBe(1)
    expect(userResponse.username).toBe("nake89@gmail.com")
    expect(userResponse.scopes.includes("root")).toBe(true)
  })

  it("getUser_ExpectFailure", async () => {
    const us = new UserService()
    const userResponse: null = (await us.getUser(10000)) as null
    expect(userResponse).toBeFalsy()
  })
  
  it("lockUser_ExpectSuccess", async () => {
    const us = new UserService()
    const lockResponse: boolean = await us.lockUser(2, "root", "uncool")
    expect(lockResponse).toBe(true)
  })

  it("lockUser_ExpectFailure", async () => {
    const us = new UserService()
    const lockResponse: boolean = await us.lockUser(10000, "root", "uncool")
    expect(lockResponse).toBe(false)
  })

  it("loginWithLockedUser_ExpectLoginFail", async () => {
    const us = new UserService()
    const username: string = "nake89+new@gmail.com"
    const password: string = "asdaAa12aaaa3!!"
    const loginUserResult = await us.loginUser(username, password)
    expect(loginUserResult.ok).toBe(0)
    expect(loginUserResult.data.error).toBe("User is locked.")
  })

  it("deleteUser_test", async () => {
    const us = new UserService()
    const deleteResponse: boolean = await us.deleteUser(2)
    expect(deleteResponse).toBe(true)
    const deleteResponseCheck: boolean = await us.deleteUser(2)
    expect(deleteResponseCheck).toBe(false)
  })
})
