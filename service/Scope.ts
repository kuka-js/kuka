import User from "../entities/User"
import Scope from "../entities/Scope"
import ProjectConnection from "./Connection"
import {
  CreateDBAdapter,
  DatabaseImpl,
  convert,
} from "./Database/DatabaseFactory"
export default class ScopeService {
  async getScopes(username: string): Promise<string[] | boolean> {
    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      const scopes: string[] = await DBImpl.getScopes(username)
      return scopes
    } catch (e) {
      return false
    }
  }

  async addScope(userId: string, scope: string): Promise<boolean> {
    try {
      await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return false
    }
    const user: User = await User.findOne(
      { id: userId },
      { relations: ["scopes"] }
    )
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

  async removeScope(userId: string, scope: string) {
    try {
      await ProjectConnection.connect()
    } catch (e) {
      console.log(e)
      return false
    }
    const user: User = await User.findOne(
      { id: userId },
      { relations: ["scopes"] }
    )
    if (user) {
      user.scopes = user.scopes.filter(e => e.scope !== scope)
      await User.save(user)
      return true
    } else {
      return false
    }
  }
}
