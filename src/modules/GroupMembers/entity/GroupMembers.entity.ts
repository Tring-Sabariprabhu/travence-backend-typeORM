import { ObjectType, Field } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from "typeorm"; 
import { User } from "../../User/entity/User.entity";
import { Group } from "../../Group/entity/Group.entity";

export enum GroupMember_Role{
    ADMIN = "admin",
    MEMBER = "member"
}

@Entity({name: "group_members"})
@ObjectType()
export class GroupMember{
    @PrimaryGeneratedColumn('uuid')
    @Field()
    member_id!: string

    @Column(
        {
            type: "enum",
            enum: GroupMember_Role,
            default: GroupMember_Role.MEMBER
            })
    @Field()
    user_role!: string

    @ManyToOne(()=> User, (user)=> user.user_id)
    @JoinColumn({name: "user_id"})
    user_id!: string

    @ManyToOne(()=> Group, (group)=> group.group_id)
    @JoinColumn({name: "group_id"})
    group_id!: string

    @CreateDateColumn()
    @Field()
    joinet_at!: Date

    @UpdateDateColumn()
    @Field({nullable: true})
    updated_at?: Date

    @DeleteDateColumn()
    @Field({nullable: true})
    deleted_at?: Date

}