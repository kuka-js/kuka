import { Connection } from "typeorm";
export default class ProjectConnection {
    static connect(): Promise<Connection>;
}
