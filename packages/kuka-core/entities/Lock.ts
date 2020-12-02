import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export default class Lock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: true})
  reason: string

  @Column()
  lockedBy: string

  @Column()
  lockedAt: Date

  @Column()
  username: string
}
