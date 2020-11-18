import { BaseEntity } from "typeorm";
export default class Lock extends BaseEntity {
    id: number;
    reason: string;
    lockedBy: string;
    lockedAt: Date;
    username: string;
}
