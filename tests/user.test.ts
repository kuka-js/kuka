require("reflect-metadata")
import userController from "../controllers/User"
require("dotenv").config({path: process.cwd() + "/.env.testing"})

describe("user tests", () => {
  beforeAll(() => {})

  it("saveUser_password_too_weak", async () => {
    const uc = new userController()
    const saveUserResult = await uc.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa1"
    )

    expect(saveUserResult.ok).toBe(0)
    expect(saveUserResult.data.username).toBe("nake89@gmail.com")
    expect(saveUserResult.data.message).toBe("Password is too weak")
  })

  it("saveUser_success", async () => {
    const uc = new userController()
    const saveUserResult = await uc.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa12aaaa3!!"
    )

    expect(saveUserResult.ok).toBe(1)
    expect(saveUserResult.data.userId).toBe(1)
    expect(saveUserResult.data.username).toBe("nake89@gmail.com")
    expect(saveUserResult.data.message).toBe("User successfully created!")
  })

  it("saveUser_user_already_exists", async () => {
    const uc = new userController()
    const saveUserResult = await uc.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa12aaaa3!!"
    )
    expect(saveUserResult.ok).toBe(0)
    expect(saveUserResult.data.username).toBe("nake89@gmail.com")
    expect(saveUserResult.data.message).toBe(
      "Couldn't create user. User exists"
    )
  })

  it("saveAndloginUser_test", async () => {
    const uc = new userController()
    const username = "nake89+new@gmail.com"
    const password = "asdaAa12aaaa3!!"
    const saveUserResult = await uc.registerUser(username, username, password)
    const loginUserResult = await uc.loginUser(username, password)
    expect(saveUserResult.ok).toBe(1)
    expect(saveUserResult.data.userId).toBe(2)
    expect(saveUserResult.data.username).toBe(username)
    expect(saveUserResult.data.message).toBe("User successfully created!")
    expect(loginUserResult.ok).toBe(1)
  })
})
