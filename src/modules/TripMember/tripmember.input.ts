import { Field, InputType } from "type-graphql";


@InputType()
export class TripMemberInput{
    @Field()
    group_member_id!: string
}
@InputType()
export class CreateTripMembersInput{

    @Field()
    group_id!: string

    @Field()
    trip_id!: string
    
    @Field(()=> [String])
    group_members!: string[]
}

@InputType()
export class DeleteTripMemberInput{
    @Field()
    trip_member_id!: string
}