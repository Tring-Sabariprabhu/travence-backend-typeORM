import { Field, InputType } from "type-graphql";


@InputType()
export class GroupListInput{

    @Field()
    user_id!: string

}