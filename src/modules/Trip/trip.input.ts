import { Field, InputType, ObjectType } from "type-graphql";
import { Activity, Trip_Status } from "./entity/trip.entity";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column } from "typeorm";

@InputType()
export class CreateTripInput{

    @Field()
    group_id!: string

    @Field()
    admin_id?: string

    @Field()
    trip_name!: string

    @Field()
    trip_description!: string
    
    @Field()
    start_date!: Date
    
    @Field()
    days_count!: number

    @Field()
    members?: string[]

    @Field(()=> [String])
    checklists!: string[]

    @Field(()=> [Activity])
    activities!: Activity[]
    
} 

