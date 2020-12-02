import RefreshTokenService, {
  RefreshTokenServiceError,
} from "../service/RefreshTokenService"
import UserService from "../service/User"

require("reflect-metadata")
require("dotenv").config({ path: process.cwd() + "/.env.testing" })

describe("RefreshTokenService_tests", () => {
  beforeAll(async () => {
    const uc = new UserService()
    await uc.registerUser(
      "nake89@gmail.com",
      "nake89@gmail.com",
      "asdaAa12aaaa3!!"
    )
  })

  it("refreshToken_ExpectSuccess", async () => {
    const mockCompareRefreshTokens = jest.fn()
    mockCompareRefreshTokens.mockReturnValue(true)
    RefreshTokenService.compareRefreshTokens = mockCompareRefreshTokens.bind(
      RefreshTokenService
    )
    const result = await RefreshTokenService.refreshToken(
      "nake89@gmail.com",
      "old"
    )
    expect(result.ok).toBe(1)
    expect(typeof result.refreshToken === "string").toBe(true)
  })

  it("refreshToken_ExpectFailure", async () => {
    const mockCompareRefreshTokens = jest.fn()
    mockCompareRefreshTokens.mockReturnValue(false)
    RefreshTokenService.compareRefreshTokens = mockCompareRefreshTokens.bind(
      RefreshTokenService
    )
    const result = await RefreshTokenService.refreshToken(
      "nake89@gmail.com",
      "old"
    )
    expect(result.ok).toBe(0)
    expect(result.errorCode).toBe(
      RefreshTokenServiceError.REFRESH_TOKEN_INVALID
    )
  })
})
