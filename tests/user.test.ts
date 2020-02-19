require("reflect-metadata")
import UserService, {getUserListResponse} from "../service/User"
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

  it("saveAndloginUser_test", async () => {
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
    expect(typeof loginUserResult.data.refreshToken).toBe("string")
  })

  it("getUserList_test", async () => {
    const us = new UserService()
    const userListResult: getUserListResponse[] = await us.getUserList()
    expect(Array.isArray(userListResult)).toBe(true)
    expect(userListResult.length).toBe(2)
    expect(userListResult[0].userId).toBe(1)
    expect(userListResult[0].username).toBe("nake89@gmail.com")
    expect(userListResult[0].scopes.includes("root")).toBe(true)
  })

  it("deleteUser_test", async () => {
    const us = new UserService()
    const deleteResponse: boolean = await us.deleteUser(2)
    const userListResult: getUserListResponse[] = await us.getUserList()
    expect(deleteResponse).toBe(true)
    expect(Array.isArray(userListResult)).toBe(true)
    expect(userListResult.length).toBe(1)
  })
})
