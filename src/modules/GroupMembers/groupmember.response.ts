import { Field, ObjectType } from "type-graphql";

import { User } from "../User/entity/User.entity";
import { ManyToOne } from "typeorm";
import { Group } from "../Group/entity/Group.entity";
import { GroupMember_Role } from "./entity/GroupMembers.entity";

@ObjectType()
export class GroupMemberResponse {

    @Field()
    member_id!: string

    @Field()
    user_role!: GroupMember_Role

    @ManyToOne(()=> User, user => user.user_id)
    @Field(()=> User, {name: "user_id", nullable: true})
    user?: User

    @ManyToOne(()=> Group, group=> group.group_id)
    @Field(()=> Group, {name: "group_id", nullable: true})
    group?: Group

    @Field()
    joined_at!: Date

    @Field({ nullable: true })
    updated_at?: Date

    @Field({ nullable: true })
    deleted_at?: Date
    
}
