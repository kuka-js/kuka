import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm"
import User from "./User"

@Entity()
export default class LockUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: true})
  reason: string

  @Column()
  lockedBy: string

  @Column()
  lockedAt: Date

  @OneToOne(
    () => User,
    user => user.lockUser,
    {
      onDelete: "CASCADE"
    }
  )
  public user?: User
}
