import { ObjectType, Field } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from "typeorm"; 
import { User } from "../../User/entity/User.entity";
import { Group } from "../../Group/entity/Group.entity";
import { GroupInvite } from "../../GroupInvite/entity/GroupInvites.entity";
import { Trip } from "../../Trip/entity/trip.entity";
import { TripMember } from "../../TripMember/entity/TripMember.entity";

export enum GroupMember_Role{
    ADMIN = "admin",
    MEMBER = "member"
}

@Entity({name: "group_members"})
@ObjectType()
export class GroupMember{
    @PrimaryGeneratedColumn('uuid')
    @Field()
    member_id!: string

    @Column(
        {
            type: "enum",
            enum: GroupMember_Role,
            default: GroupMember_Role.MEMBER
            })
    @Field()
    user_role!: GroupMember_Role

    @ManyToOne(()=> User, (user)=> user.joined_groups)
    @JoinColumn({name: "user_id"})
    @Field(()=> User)
    user?: User

    @ManyToOne(()=> Group, (group)=> group.group_members)
    @JoinColumn({name: "group_id"})
    @Field(()=> Group)
    group!: Group

    @CreateDateColumn()
    @Field()
    joined_at!: Date

    @UpdateDateColumn()
    @Field({nullable: true})
    updated_at?: Date

    @DeleteDateColumn()
    @Field({nullable: true})
    deleted_at?: Date

    @OneToMany(()=> GroupInvite, (invite)=> invite.invited_by)
    @Field(()=> [GroupInvite])
    invited_list?: GroupInvite[]

    @OneToMany(()=> Trip, trip=> trip.created_by)
    @Field(()=> [Trip])
    created_trips?: Trip[]
    
    @OneToMany(()=> TripMember, trip_member=> trip_member.group_member)
    @Field(()=> [TripMember])
    joined_trips?: TripMember[]
}