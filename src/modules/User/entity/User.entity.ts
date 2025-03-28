import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" }) 
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid') 
  user_id!: string

  @Column("varchar", {length: 100})
  @Field()
  name!: string

  @Column("varchar", {length: 50})
  @Field()
  email!: string

  @Column("varchar", {length: 50})
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

}