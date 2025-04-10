import { Field, InputType } from "type-graphql";
import { GroupMember_Role } from "./GroupMembers.entity";

@InputType()
export class GroupMembersForTripInput{
    @Field({nullable: true})
    group_id?: string

    @Field({nullable: true})
    trip_id?: string
}
@InputType()
export class GroupMemberInput{

    @Field()
    group_id!: string
}
@InputType()
export class CreateGroupMemberInput{
    @Field()
    group_id!: string

    @Field()
    user_role!: GroupMember_Role
}

@InputType()
export class GroupMemberActionsInput{
    @Field()
    admin_id!: string

    @Field()
    member_id!: string
}

