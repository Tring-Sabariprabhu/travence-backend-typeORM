import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTripMembers{

    @Field()
    group_id!: string

    @Field()
    trip_id!: string
    
    @Field()
    members!: string[]
}