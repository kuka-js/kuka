import User from "../entities/User"
import Scope from "../entities/Scope"
import {Connection} from "typeorm"
import ProjectConnection from "../service/connection"

export default class ScopeController {
  async getScopes(userId: number): Promise<string[] | boolean> {
    try {
      await ProjectConnection.connect()
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

  async addScope(userId: number, scope: string): Promise<boolean> {
    try {
      await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return false
    }
    const user: User = await User.findOne({id: userId}, {relations: ["scopes"]})
    if (user) {
      for (let item of user.scopes) {
        if (item.scope == scope) {
          return false
        }
      }
      const newScope: Scope = new Scope()
      newScope.scope = scope
      await Scope.save(newScope)
      user.scopes.push(newScope)
      await User.save(user)
      return true
    } else {
      return false
    }
  }

  async removeScope(userId: number, scope: string) {
    try {
      await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return false
    }
    const user: User = await User.findOne({id: userId}, {relations: ["scopes"]})
    if (user) {
      user.scopes = user.scopes.filter(e => e.scope !== scope)
      await User.save(user)
      return true
    } else {
      return false
    }
  }
}
