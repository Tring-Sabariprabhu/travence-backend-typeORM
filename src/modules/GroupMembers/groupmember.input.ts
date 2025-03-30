import { Field, InputType } from "type-graphql";
import { GroupMember_Role } from "./entity/GroupMembers.entity";
import { User } from "../User/entity/User.entity";
import { Group } from "../Group/entity/Group.entity";

@InputType()
export class CreateGroupMemberInput{
    @Field()
    group_id!: string

    @Field()
    user_id!: string

    @Field()
    user_role!: string
}

@InputType()
export class ChangeRoleInput{
    @Field()
    admin_id!: string

    @Field()
    member_id!: string
}

@InputType()
export class DeleteGroupMemberInput{
    @Field()
    admin_id!: string

    @Field()
    member_id!: string
}