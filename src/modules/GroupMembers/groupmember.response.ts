import { Field, ObjectType } from "type-graphql";
import { ManyToOne } from "typeorm";

@ObjectType()
export class GroupMemberResponse {
    @Field()
    member_id!: string

    @Field()
    user_role!: string

    @Field()
    user_id!: string

    @Field()
    group_id!: string

    @Field()
    joinet_at!: Date

    @Field({ nullable: true })
    updated_at?: Date

    @Field({ nullable: true })
    deleted_at?: Date

    
}
