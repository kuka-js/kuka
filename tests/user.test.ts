require("reflect-metadata")
import userController from "../controllers/User"
require("dotenv").config({path: process.cwd() + "/.env.testing"})

describe("user tests", () => {
  beforeAll(() => {})

  it("saveUser test", async () => {
    const uc = new userController()
    const saveUserResult = await uc.saveUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa12aaaa3!!"
    )
    expect(saveUserResult.ok).toBe(1)
    expect(saveUserResult.data.userId).toBe(1)
    expect(saveUserResult.data.username).toBe("nake89@gmail.com")
    expect(saveUserResult.data.message).toBe("User successfully created!")
  })
})
