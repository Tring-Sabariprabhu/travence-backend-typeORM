import { Field, InputType, ObjectType } from "type-graphql";
import { Activity, Trip_Status } from "./entity/trip.entity";

@InputType()
export class ActivityInput{
    @Field()
    activity!: string

    @Field()
    budget!: number
}
@InputType()
export class CreateTripInput{

    @Field()
    group_member_id?: string

    @Field()
    trip_name!: string

    @Field()
    trip_description!: string
    
    @Field()
    trip_start_date!: Date
    
    @Field()
    trip_days_count!: number

    @Field()
    trip_budget!: number

    @Field(()=> [String])
    trip_members?: string[]

    @Field(()=> [String])
    trip_checklists!: string[]

    @Field(()=> [ActivityInput])
    trip_activities!: ActivityInput[]
} 
@InputType()
export class UpdateTripInput extends CreateTripInput{
    @Field()
    trip_id!: string
}

@InputType()
export class DeleteTripInput{

    @Field()
    group_member_id!: string

    @Field()
    trip_id!: string
}
@InputType()
export class JoinedTripsInput{
    @Field()
    member_id!: string

    @Field()
    filter_type!: string
}

@InputType()
export class TripInput{
    
    @Field()
    member_id!: string

    @Field()
    trip_id!: string
}