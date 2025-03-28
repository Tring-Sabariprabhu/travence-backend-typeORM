import {Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, OneToMany, JoinColumn, ManyToOne} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { GroupMember } from "../../GroupMembers/entity/GroupMembers.entity";
import { User } from "../../User/entity/User.entity";

@Entity({name: "groups"})
@ObjectType()
export class Group{
    @PrimaryGeneratedColumn('uuid')
    group_id!: string

    @Column("varchar", {length: 100})
    @Field()
    group_name!: string

    @Column("varchar", {length: 255})
    @Field()
    group_description!: string

    @ManyToOne(()=> User, (user)=> user.user_id)
    @JoinColumn()
    created_by!: string

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