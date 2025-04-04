import { Field, ObjectType } from "type-graphql";
import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupMember } from "../../GroupMembers/entity/GroupMembers.entity";
import { Trip } from "../../Trip/entity/trip.entity";

@Entity({name: "trip_members"})
@ObjectType()
export class TripMember{
    @PrimaryGeneratedColumn('uuid')
    @Field()
    trip_member_id!: string

    @ManyToOne(()=> Trip, (trip)=> trip.trip_members)
    @JoinColumn({name: "trip_id"})
    @Field(()=> Trip)
    trip!: Trip
    
    @ManyToOne(()=> GroupMember, (group_member)=> group_member.joined_trips)
    @JoinColumn({name: "group_member_id"})
    @Field(()=> GroupMember)
    group_member!: GroupMember

    @CreateDateColumn()
    @Field()
    joined_at!: Date

    @UpdateDateColumn()
    @Field({nullable: true})
    updated_at?: Date

    @DeleteDateColumn()
    @Field({nullable: true})
    deleted_at?: Date

}