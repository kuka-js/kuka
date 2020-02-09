import User from "../entities/User"
import Scope from "../entities/Scope"
import {Connection} from "typeorm"
import ProjectConnection from "../service/connection"

export default class ScopeController {
  async getScopes(userId: number): Promise<string[] | boolean> {
    try {
      let connection: Connection = await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return false
    }
    const user: User = await User.findOne({id: userId})
    if (user) {
      const scopeArray: Scope[] = await Scope.find({user})
      const scopes: string[] = scopeArray.map(item => {
        return item.scope
      })
      return scopes
    } else {
      return false
    }
  }
}
