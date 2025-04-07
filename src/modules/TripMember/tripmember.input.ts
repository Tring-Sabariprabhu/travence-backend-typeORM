import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTripMembersInput{

    @Field()
    group_id!: string

    @Field()
    trip_id!: string
    
    @Field(()=> [String])
    group_members!: string[]
}
