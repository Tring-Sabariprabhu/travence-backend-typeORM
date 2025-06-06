import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { GroupMember } from "../../GroupMembers/entity/GroupMembers.entity";
import { Group } from "../../Group/entity/Group.entity";

@Entity({ name: "users" }) 
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid') 
  @Field()
  user_id!: string

  @Column("varchar", {length: 100})
  @Field()
  name!: string

  @Column("varchar", {length: 50})
  @Field()
  email!: string

  @Column("varchar", {length: 255})
  @Field()
  password!: string

  @CreateDateColumn()
  @Field()
  created_at!: Date

  @UpdateDateColumn()
  @Field({nullable: true})
  updated_at?: Date

  @DeleteDateColumn()
  @Field({nullable: true})
  deleted_at?: Date

  @OneToMany(() => Group, (group) => group.created_by)
  created_groups?: Group[];

  @OneToMany(() => GroupMember, (group_member) => group_member.group)
  joined_groups?: GroupMember[];

}