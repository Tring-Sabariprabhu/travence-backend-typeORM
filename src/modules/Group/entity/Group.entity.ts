import {Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "../../User/entity/User.entity";
import { GroupMember } from "../../GroupMembers/entity/GroupMembers.entity";
import { Trip } from "../../Trip/entity/trip.entity";

@Entity({name: "groups"})
@ObjectType()
export class Group{
    @PrimaryGeneratedColumn('uuid')
    @Field()
    group_id!: string

    @Column("varchar", {length: 100})
    @Field()
    group_name!: string

    @Column("varchar", {length: 255})
    @Field()
    group_description!: string

    @ManyToOne(() => User, (user) => user.created_groups)
    @JoinColumn({ name: "created_by" })
    @Field(() => User)
    created_by!: User;

    @CreateDateColumn()
    @Field()
    created_at!: Date

    @UpdateDateColumn()
    @Field({nullable: true})
    updated_at?: Date

    @DeleteDateColumn()
    @Field({nullable: true})
    deleted_at?: Date

    @OneToMany(() => GroupMember, (groupMember) => groupMember.group)
    @Field(() => [GroupMember], { nullable: true })
    group_members?: GroupMember[];

    @OneToMany(()=> Trip, (trip)=> trip.group)
    @Field(()=> [Trip])
    trips?: Trip[]
}