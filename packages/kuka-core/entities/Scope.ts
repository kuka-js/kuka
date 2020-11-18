import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm"
import User from "./User"

@Entity()
export default class Scope extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  scope: string

  @ManyToOne(
    type => User,
    user => user.scopes,
    {onDelete: "CASCADE"}
  )
  user: User
}
