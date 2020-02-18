import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  OneToOne,
  JoinColumn
} from "typeorm"
import Scope from "./Scope"
import RefreshToken from "./RefreshToken"

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

  @Column()
  userType: string

  @OneToMany(
    type => Scope,
    scope => scope.user
  )
  scopes: Scope[]

  @OneToOne(type => RefreshToken)
  @JoinColumn()
  refreshToken: RefreshToken
}
