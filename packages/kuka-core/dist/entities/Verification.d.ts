import { BaseEntity } from "typeorm";
export default class Verification extends BaseEntity {
    id: number;
    username: string;
    verifyLinkId: string;
    clicked: boolean;
    createdDate: Date;
    updatedDate: Date;
}
