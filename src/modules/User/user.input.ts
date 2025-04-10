import { InputType, Field } from "type-graphql";

@InputType()
export class SigninInput {

    @Field()
    email!: string

    @Field()
    password!: string
}

@InputType()
export class SignupInput {

    @Field()
    name!: string

    @Field()
    email!: string

    @Field()
    password!: string

}

@InputType()
export class UpdateUserInput{
    
    @Field()
    name!: string

    @Field()
    password!: string
}