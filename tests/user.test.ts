require("reflect-metadata")
import UserService from "../service/User"
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
  })
})
