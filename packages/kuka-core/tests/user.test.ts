require("reflect-metadata")
import UserService, { UserObject } from "../service/User"
//require("dotenv").config({ path: process.cwd() + "/.env.testing" })
//require("dotenv").config({ path: __dirname + "/../.env.testing" })
// const path = require("path")
// const fullPath = path.resolve(__dirname, "./../.env.testing")
// console.log(
//   "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
// )
// console.log(fullPath)
// console.log(
//   "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
// )
// require("dotenv").config({
//   path: path.resolve(__dirname, "./../.env.testing"),
// })

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
    //expect(registerUserResult.ok).toBe(0)
    expect(registerUserResult.data.username).toBe("nake89@gmail.com")
    expect(registerUserResult.data.message).toBe("Username taken")
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
    expect(registerUserResult.data.username).toBe(username)
    expect(registerUserResult.data.message).toBe("User successfully created!")
    expect(loginUserResult.ok).toBe(1)
    expect(typeof loginUserResult.data.token).toBe("string")
    expect(Number.isInteger(loginUserResult.data.expiry)).toBe(true)
  })

  it("renewJWTToken_ExpectSuccess", async () => {
    const username = "nake89@gmail.com"
    const renewTokenResult = await UserService.renewJWTToken(username)
    expect(typeof renewTokenResult.username === "string").toBe(true)
    expect(renewTokenResult.message).toBe("JWT renewed succesfully.")
    expect(typeof renewTokenResult.token === "string").toBe(true)
    expect(Number.isInteger(renewTokenResult.expiry)).toBe(true)
  })

  it("renewJWTToken_ExpectFailure", async () => {
    const renewUsername = "usernotexist@gmail.com"
    let thrown = false
    try {
      await UserService.renewJWTToken(renewUsername)
    } catch (e) {
      thrown = true
    }
    expect(thrown).toBe(true)
    // Cant get the following to work. That is why I use catch and use thrown boolean
    // expect(async () => {
    //  await UserService.renewJWTToken("asasd@asdsad.com")
    //}).toThrowError(Error)
  })

  it("getUserList_test", async () => {
    const us = new UserService()
    const userListResult: UserObject[] = await us.getUserList()
    expect(Array.isArray(userListResult)).toBe(true)
    expect(userListResult.length).toBe(2)
    expect(userListResult[0].username).toBe("nake89@gmail.com")
    expect(userListResult[0].scopes.includes("root")).toBe(true)
  })

  it("getUser_ExpectSuccess", async () => {
    const us = new UserService()
    const userResponse: UserObject = (await us.getUser(
      "nake89@gmail.com"
    )) as UserObject
    expect(userResponse.username).toBe("nake89@gmail.com")
    expect(userResponse.scopes.includes("root")).toBe(true)
  })

  it("getUser_ExpectFailure", async () => {
    const us = new UserService()
    let thrown = false
    try {
      await us.getUser("usernotexist@gmail.com")
    } catch (e) {
      thrown = true
    }
    expect(thrown).toBe(true)
  })

  it("lockUser_ExpectSuccess", async () => {
    const us = new UserService()
    const lockResponse: boolean = await us.lockUser(
      "nake89+new@gmail.com",
      "nake89@gmail.com",
      "uncool"
    )
    expect(lockResponse).toBe(true)
  })

  it("lockUser_ExpectFailure", async () => {
    const us = new UserService()
    const lockResponse: boolean = await us.lockUser(
      "notexist@gmail.com",
      "nake89@gmail.com",
      "uncool"
    )
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
    const deleteResponse: boolean = await us.deleteUser("nake89+new@gmail.com")
    expect(deleteResponse).toBe(true)
    const deleteResponseCheck: boolean = await us.deleteUser(
      "nake89+new@gmail.com"
    )
    expect(deleteResponseCheck).toBe(false)
  })
})
