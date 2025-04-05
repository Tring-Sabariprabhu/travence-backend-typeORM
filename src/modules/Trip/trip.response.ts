import { Field, ObjectType } from "type-graphql";
import { Activity, Trip_Status } from "./entity/trip.entity";
import { ManyToOne, OneToMany } from "typeorm";
import { Group } from "../Group/entity/Group.entity";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import { TripMember } from "../TripMember/entity/TripMember.entity";

@ObjectType()
export class TripResponse{
    @Field()
    trip_id!: string

    @Field()
    trip_name!: string

    @Field()
    trip_description!: string

    @Field()
    trip_status!: Trip_Status

    @ManyToOne(()=> Group, (group)=> group.trips)
    @Field(()=> Group, {nullable: true})
    group?: Group
    
    @ManyToOne(()=> GroupMember, (group_member)=> group_member.created_trips)
    @Field(()=> GroupMember, {nullable: true})
    created_by?: GroupMember
    
    @Field()
    trip_start_date!: Date
    
    @Field()
    trip_days_count!: number

    @Field()
    trip_budget!: number
    
    @Field(()=> [Activity])
    trip_activities!: Activity[]
        
    @Field(()=> [String])
    trip_checklists!: string[]
     
    @Field()
    created_at!: Date
    
    @Field({nullable: true})
    updated_at?: Date

    
    @Field({nullable: true})
    deleted_at?: Date

    @OneToMany(()=> TripMember, (trip_member)=> trip_member.trip)
    @Field(()=> [TripMember], {nullable: true})
    trip_members?: TripMember[]
    
}