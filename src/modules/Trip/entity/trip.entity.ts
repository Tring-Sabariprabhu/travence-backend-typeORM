import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupMember } from "../../GroupMembers/entity/GroupMembers.entity";
import { Group } from "../../Group/entity/Group.entity";
import { TripMember } from "../../TripMember/entity/TripMember.entity";
import { GraphQLJSONObject } from "graphql-type-json";

export enum Trip_Status{
    UPCOMING = 'upcoming',
    CANCELED = 'canceled',
    COMPLETED = 'completed'
}

@ObjectType()
export class Activity{
    @Field()
    activity!: string

    @Field()
    budget!: number
}

@Entity("trips")
@ObjectType()
export class Trip{

    @PrimaryGeneratedColumn('uuid')
    @Field()
    trip_id!: string

    @Column()
    @Field()
    trip_name!: string

    @Column()
    @Field()
    trip_description!: string

    @Column()
    @Field()
    trip_start_date!: Date

    @Column()
    @Field()
    trip_days_count!: number
    
    @Column()
    @Field()
    trip_budget!: number

    @Column({
        type: "enum",
        enum: Trip_Status,
        default: Trip_Status.UPCOMING
    })
    @Field()
    trip_status!: Trip_Status

    @Column({type: "jsonb", nullable: true})
    @Field(()=> [Activity])
    trip_activities!: Activity[]

    @Column({type: "jsonb", nullable: true})
    @Field(()=> [String])
    trip_checklists!: string[]

    @ManyToOne(()=> Group, (group)=> group.trips)
    @JoinColumn({name: "group_id"})
    @Field(()=> Group)
    group!: Group

    @ManyToOne(()=> GroupMember, (group_member)=> group_member.created_trips)
    @JoinColumn({name: "created_by"})
    @Field(()=> GroupMember)
    created_by!: GroupMember

    @CreateDateColumn()
    @Field()
    created_at!: Date

    @UpdateDateColumn()
    @Field({nullable: true})
    updated_at?: Date

    @DeleteDateColumn()
    @Field({nullable: true})
    deleted_at?: Date

    @OneToMany(()=> TripMember, (trip_member)=> trip_member.trip)
    @Field(()=> [TripMember], {nullable: true})
    trip_members?: TripMember[]
}