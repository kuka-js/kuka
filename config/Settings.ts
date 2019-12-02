// import {Dialect} from "sequelize/types"
const Sequelize = require("sequelize/types")
const {Dialect} = Sequelize

export default class Settings {
  private database: string = "domeeni"
  private username: string = "domeeni"
  private password: string = "yYN@6hZCgyBJ1&PVpXld@"
  private host: string = "3.123.51.95"
  private dialect: Dialect = "mysql"

  public getDatabase(): string {
    return this.database
  }

  public getUsername(): string {
    return this.username
  }

  public getPassword(): string {
    return this.password
  }

  public getHost(): string {
    return this.host
  }
  public getDialect(): Dialect {
    return this.dialect
  }
}
