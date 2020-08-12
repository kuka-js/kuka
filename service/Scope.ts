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

  async addScope(username: string, scope: string): Promise<void> {
    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      await DBImpl.addScope(username, scope)
    } catch (e) {
      throw "Could not add scope"
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
