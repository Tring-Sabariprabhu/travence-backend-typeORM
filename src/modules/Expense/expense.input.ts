import { Field, InputType } from "type-graphql";

@InputType()
export class ExpenseInput{

    @Field()
    toPay!: string

    @Field()
    paidBy!: string

    @Field()
    amount!: number
}
@InputType()
export class CreateExpensesInput{

    @Field()
    trip_id!: string

    @Field()
    created_by!: string

    @Field(()=> [ExpenseInput])
    expenses!: ExpenseInput[]
}