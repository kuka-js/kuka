import { BaseEntity } from "typeorm";
import Scope from "./Scope";
export default class User extends BaseEntity {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    refreshToken: string;
    scopes: Scope[];
    lockId: number;
}
