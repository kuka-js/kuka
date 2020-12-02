import {BaseEntity, Column, Entity, OneToMany, PrimaryColumn} from "typeorm"
import Scope from "./Scope"

@Entity()
export default class User extends BaseEntity {
  @PrimaryColumn()
  id: string

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

  @OneToMany((type) => Scope, (scope) => scope.user)
  scopes: Scope[]

  @Column({nullable: true})
  public lockId: number
}
