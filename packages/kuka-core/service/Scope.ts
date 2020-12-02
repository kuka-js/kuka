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

  async removeScope(username: string, scope: string): Promise<void> {
    const DBImpl: DatabaseImpl = CreateDBAdapter(
      convert(process.env.DB_PROVIDER)
    )
    try {
      await DBImpl.removeScope(username, scope)
    } catch (e) {
      throw "Could not remove scope"
    }
  }
}
