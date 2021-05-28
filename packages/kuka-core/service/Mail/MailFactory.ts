import { PlugLoad } from "./plugload"

interface EmailPlugin {
  pluginName: string
  pluginType: string
  sendEmail(email: string, subject: string, message: string): void
}

interface KukaConfig {
  plugins: string[]
  mailProvider: string
}

const defaultMailProviders = ["AWSSES", "SMTP"]

export class MailProvider {
  provider: MailImpl
  async getMailProvider() {
    const provider = new PlugLoad("pluginloader", "plugins")
    if (defaultMailProviders.indexOf(provider.config.mailProvider) === -1) {
      await provider.getPlugins()
      for (let plugin of provider.loadedPlugins) {
        const initPlugin = new plugin()
        if (initPlugin.pluginName == "EmailPlugin") {
          const castPlugin = initPlugin as EmailPlugin
        }
      }
    }
  }
  async sendEmail(email: string, subject: string, message: string) {
    this.provider.sendEmail(email, subject, message)
  }
}
export interface MailImpl {
  sendEmail(email: string, subject: string, message: string): Promise<void>
}
