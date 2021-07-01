require("reflect-metadata")
import ScopeService from "../service/Scope"
import UserService from "../service/User"

//require("dotenv").config({ path: process.cwd() + "/.env.testing" })

const user1 = "nake89@gmail.com"
const user2 = "nake89+1@gmail.com"
describe("scope tests", () => {
  beforeAll(async () => {
    const userService = new UserService()
    await userService.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa12aaaa3!!"
    )

    await userService.registerUser(
      "nake89+1@gmail.com",
      "nake89+1@gmail.com",
      "asdaAa12aaaa3!!"
    )
  })

  it("getScopes_has_root", async () => {
    const sc = new ScopeService()
    const scopeResult = await sc.getScopes(user1)

    if (Array.isArray(scopeResult)) {
      expect(scopeResult.includes("root")).toBe(true)
    } else {
      throw "ScopeResult returned a boolean"
    }
  })

  it("getScopes_does_not_have_root", async () => {
    const sc = new ScopeService()
    const scopeResult = await sc.getScopes(user2)

    if (Array.isArray(scopeResult)) {
      expect(scopeResult.includes("root")).toBe(false)
    } else {
      throw "ScopeResult returned a boolean"
    }
  })

  it("addScope_adds_scope", async () => {
    const sc = new ScopeService()
    const scopeResult = await sc.addScope(user2, "test_scope")
    const scopeResultList = await sc.getScopes(user2)

    expect(scopeResult).toBeTruthy
    if (Array.isArray(scopeResultList)) {
      expect(scopeResultList.includes("test_scope")).toBe(true)
    } else {
      throw "ScopeResultList returned a boolean"
    }
  })

  it("removeScope_removes_scope", async () => {
    const sc = new ScopeService()
    const scopeResult = await sc.removeScope(user2, "test_scope")
    const scopeResultList = await sc.getScopes(user2)

    expect(scopeResult).toBeTruthy
    if (Array.isArray(scopeResultList)) {
      expect(scopeResultList.includes("test_scope")).toBe(false)
    } else {
      throw "ScopeResultList returned a boolean"
    }
  })
})
