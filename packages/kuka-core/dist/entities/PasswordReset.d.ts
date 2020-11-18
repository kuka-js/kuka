import { BaseEntity } from "typeorm";
export default class PasswordReset extends BaseEntity {
    id: number;
    username: string;
    email: string;
    passwordResetId: string;
    clicked: boolean;
    creationDate: Date;
    updateDate: Date;
}
