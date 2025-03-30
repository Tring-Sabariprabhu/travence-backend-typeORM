import { Field, InputType } from "type-graphql";

@InputType()
export class CreateGroupInviteInput{
    @Field()
    invited_by!: string

    @Field(()=> [String])
    emails!: string[]
}

@InputType()
export class GetInvitedListInput{
    @Field()
    admin_id!: string
}

@InputType()
export class GetGroupInvitesInput{
    @Field()
    email!: string
}

@InputType()
export class GroupInviteActionsInput{
    @Field()
    admin_id!: string

    @Field()
    invite_id!: string
}
