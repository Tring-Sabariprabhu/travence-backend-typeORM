import { Field, InputType } from "type-graphql";
import { User } from "../User/entity/User.entity";


@InputType()
export class GroupListInput{

    @Field()
    user_id!: string

}

@InputType()
export class GroupInput{

    @Field()
    group_id!: string

}

@InputType()
export class CreateGroupInput{
    @Field()
    created_by!: string

    @Field()
    group_name!: string

    @Field()
    group_description!: string
}

@InputType()
export class UpdateGroupInput{
    @Field()
    admin_id!: string

    @Field()
    group_name!: string

    @Field()
    group_description!: string
}
