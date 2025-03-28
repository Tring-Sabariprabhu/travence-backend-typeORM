import { ObjectType, Field } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from "typeorm";
import { GroupMember } from "../../GroupMembers/entity/GroupMembers.entity";

export enum Invite_Status {
    INVITED = "invited",
    REJECTED = "rejected"
}
@Entity({ name: "group_invites" })
@ObjectType()
export class GroupInvite {
    @PrimaryGeneratedColumn('uuid')
    invite_id!: string;

    @Column("varchar", { length: 50 })
    @Field()
    email!: string;

    @Column(
        {
            type: "enum",
            enum: Invite_Status,
            default: Invite_Status.INVITED
        })
    @Field()
    invite_status!: string

    @Column("boolean")
    @Field()
    registered_user!: boolean

    @CreateDateColumn()
    @Field()
    invited_at!: string

    @ManyToOne(() => GroupMember, (member) => member.member_id)
    @Field()
    invited_by!: string;
}