require("reflect-metadata")
import Email, {OurMailResponse} from "../service/Email"
require("dotenv").config({path: process.cwd() + "/.env.testing"})
const sendMailMock = jest.fn()

jest.mock("nodemailer")

const nodemailer = require("nodemailer")
nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock})

describe("email tests", () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  it("sendEmail_smtp_success", async () => {
    const email = new Email()
    const sendMailResult = await email.sendEmail(
      "email@address.com",
      "subject",
      "message",
      "smtp"
    )

    expect(sendMailResult.ok).toBe(1)
    expect(sendMailResult.emailService).toBe("smtp")
  })
})
