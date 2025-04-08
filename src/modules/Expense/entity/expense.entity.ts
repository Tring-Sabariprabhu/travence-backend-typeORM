import { Field, ObjectType, Resolver } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TripMember } from "../../TripMember/entity/TripMember.entity";
import { Trip } from "../../Trip/entity/trip.entity";

@Entity({name: "expenses"})
@ObjectType()
export class Expense{
    @PrimaryGeneratedColumn('uuid')
    @Field()
    expense_id!: string

    @ManyToOne(()=>TripMember, (trip_member)=> trip_member.toPay)
    @JoinColumn({name: "member1"})
    @Field(()=> TripMember)
    toPay!: TripMember

    @ManyToOne(()=>TripMember, (trip_member)=> trip_member.paidFor)
    @JoinColumn({name: "member2"})
    @Field(()=> TripMember)
    paidBy!: TripMember

    @Column()
    @Field()
    amount!: number

    @ManyToOne(()=>Trip, (trip)=> trip.expense_remainders)
    @JoinColumn({name: "trip_id"})
    @Field(()=> Trip)
    trip!: Trip
}