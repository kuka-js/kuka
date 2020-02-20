import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import Scope from "./Scope"

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  passwordHash: string

  @Column()
  emailVerified: boolean

  @Column({nullable: true})
  refreshToken: string

  @OneToMany(
    type => Scope,
    scope => scope.user
  )
  scopes: Scope[]
}
