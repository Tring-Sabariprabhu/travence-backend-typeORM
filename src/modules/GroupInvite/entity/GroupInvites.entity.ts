import { ObjectType, Field } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { GroupMember } from "../../GroupMembers/entity/GroupMembers.entity";

export enum Invite_Status {
    INVITED = "invited",
    REJECTED = "rejected"
}
@Entity({ name: "group_invites" })
@ObjectType()
export class GroupInvite {
    @PrimaryGeneratedColumn('uuid')
    @Field()
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
    invited_at!: Date

    @ManyToOne(() => GroupMember, (member) => member.invited_list)
    @JoinColumn({name: "invited_by"})
    invited_by!: GroupMember;
}