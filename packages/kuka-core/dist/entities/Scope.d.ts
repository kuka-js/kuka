import { BaseEntity } from "typeorm";
import User from "./User";
export default class Scope extends BaseEntity {
    id: number;
    scope: string;
    user: User;
}
