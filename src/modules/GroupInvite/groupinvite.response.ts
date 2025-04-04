import { Field, ObjectType } from "type-graphql";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import { ManyToOne } from "typeorm";
import { Invite_Status } from "./entity/GroupInvites.entity";

@ObjectType()
export class GroupInviteResponse{
    @Field()
    invite_id!: string

    @Field()
    email!: string

    @Field()
    invite_status!: Invite_Status
    
    @Field()
    registered_user!: boolean

    @Field()
    invited_at!: Date

    @ManyToOne(()=> GroupMember, group_member=> group_member?.member_id)
    @Field(()=> GroupMember, {nullable: true})
    invited_by?: GroupMember

}