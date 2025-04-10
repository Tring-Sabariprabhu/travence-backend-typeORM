import { Field, ObjectType } from "type-graphql";


@ObjectType()
export class GroupMembersForTrip{
    @Field()
    member_id!: string

    @Field()
    name!: string

}