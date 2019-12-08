import {createConnection, getConnectionManager, Connection} from "typeorm"

export default class ProjectConnection {
  async connect(): Promise<Connection> {
    let connection: Connection
    try {
      connection = await createConnection()
    } catch (err) {
      // If AlreadyHasActiveConnectionError occurs, return already existent connection
      if (err.name === "AlreadyHasActiveConnectionError") {
        connection = getConnectionManager().get("default")
      } else {
        console.log(err)
        throw "Cant get active connection"
      }
    }
    return connection
  }
}
