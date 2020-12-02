import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm"

@Entity()
export default class PasswordReset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  passwordResetId: string

  @Column()
  clicked: boolean

  @CreateDateColumn()
  creationDate: Date

  @UpdateDateColumn()
  updateDate: Date
}
