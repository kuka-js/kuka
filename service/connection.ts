import {createConnection, getConnectionManager, Connection} from "typeorm"

export default class ProjectConnection {
  public static async connect(): Promise<Connection> {
    let connection: Connection
    try {
      connection = await createConnection()
    } catch (err) {
      // If AlreadyHasActiveConnectionError occurs, return already existent connection
      if (err.name === "AlreadyHasActiveConnectionError") {
        connection = getConnectionManager().get("default")
      } else {
        console.log(err.name)
        throw "Cant get active connection"
      }
    }
    return connection
  }
}
