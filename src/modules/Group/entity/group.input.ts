import { Field, InputType } from "type-graphql";


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
    group_id!: string
    
    @Field()
    group_name!: string

    @Field()
    group_description!: string
}

@InputType()
export class DeleteGroupInput{

    @Field()
    group_id!: string
}