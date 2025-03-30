import { Field, ObjectType } from "type-graphql";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import { User } from "../User/entity/User.entity";
import { ManyToOne, OneToMany } from "typeorm";
import { GroupMemberResponse } from "../GroupMembers/groupmember.response";


@ObjectType()
export class GroupResponse {

    @Field() 
    group_id!: string

    @Field()
    group_name!: string

    @Field()
    group_description!: string

    @ManyToOne(()=> User, user => user.user_id)
    @Field({nullable: true})
    created_by?: User

    @Field()
    created_at!: Date

    @Field({nullable: true})
    updated_at?: Date

    @Field({nullable: true})
    deleted_at?: Date

    @OneToMany(()=> GroupMember, group_member=> group_member.group)
    @Field(()=> [GroupMember], {nullable: true})
    group_members?: GroupMember[]
    
}