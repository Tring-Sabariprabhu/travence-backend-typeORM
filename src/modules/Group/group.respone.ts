import { Field, ObjectType } from "type-graphql";
import { GroupMemberResponse } from "../GroupMembers/groupmember.response";


@ObjectType()
export class GroupResponse {

    @Field() 
    group_id!: string

    @Field()
    group_name!: string

    @Field()
    group_description!: string

    @Field()
    created_by!: string

    @Field()
    created_user_email!: string

    @Field()
    created_user_name!: string

    @Field()
    created_at!: Date

    @Field({nullable: true})
    updated_at?: Date

    @Field({nullable: true})
    deleted_at?: Date
    
}