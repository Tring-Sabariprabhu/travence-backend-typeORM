import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupMember } from "../../GroupMembers/entity/GroupMembers.entity";


@Entity()
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

    @ManyToOne(()=> GroupMember, (group_member)=> group_member.created_trips)
    @JoinColumn({name: "created_by"})
    created_by!: GroupMember
}