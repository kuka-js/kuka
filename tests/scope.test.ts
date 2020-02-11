require("reflect-metadata")
import ScopeController from "../controllers/scope"
import userController from "../controllers/User"

require("dotenv").config({path: process.cwd() + "/.env.testing"})

describe("scope tests", () => {
  beforeAll(async () => {
    const uc = new userController()
    await uc.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa12aaaa3!!"
    )

    await uc.registerUser(
      "nake89+1@gmail.com",
      "nake89+1@gmail.com",
      "asdaAa12aaaa3!!"
    )
  })

  it("getScopes_has_root", async () => {
    const sc = new ScopeController()
    const scopeResult = await sc.getScopes(1)

    if (Array.isArray(scopeResult)) {
      expect(scopeResult.includes("root")).toBe(true)
    } else {
      throw "ScopeResult returned a boolean"
    }
  })

  it("getScopes_does_not_have_root", async () => {
    const sc = new ScopeController()
    const scopeResult = await sc.getScopes(2)

    if (Array.isArray(scopeResult)) {
      expect(scopeResult.includes("root")).toBe(false)
    } else {
      throw "ScopeResult returned a boolean"
    }
  })

  it("addScope_adds_scope", async () => {
    const sc = new ScopeController()
    const scopeResult = await sc.addScope(2, "test_scope")
    const scopeResultList = await sc.getScopes(2)

    expect(scopeResult).toBeTruthy
    if (Array.isArray(scopeResultList)) {
      expect(scopeResultList.includes("test_scope")).toBe(true)
    } else {
      throw "ScopeResultList returned a boolean"
    }
  })

  it("removeScope_removes_scope", async () => {
    const sc = new ScopeController()
    const scopeResult = await sc.removeScope(2, "test_scope")
    const scopeResultList = await sc.getScopes(2)

    expect(scopeResult).toBeTruthy
    if (Array.isArray(scopeResultList)) {
      expect(scopeResultList.includes("test_scope")).toBe(false)
    } else {
      throw "ScopeResultList returned a boolean"
    }
  })
})
