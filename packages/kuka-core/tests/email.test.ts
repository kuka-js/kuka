require("reflect-metadata")
import Email from "../service/Email"
require("dotenv").config({ path: process.cwd() + "/.env.testing" })
const sendMailMock = jest.fn()

jest.mock("nodemailer")

const nodemailer = require("nodemailer")
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe("email tests", () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  it("sendEmail_smtp_success", async () => {
    const email = new Email()
    let thrown = false
    try {
      await email.sendEmail("email@address.com", "subject", "message", "smtp")
    } catch (e) {
      thrown = true
    }
    expect(thrown).toBe(false)
  })
})
