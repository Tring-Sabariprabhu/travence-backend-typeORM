import { Arg, Mutation, Resolver } from "type-graphql";
import { Expense } from "./entity/expense.entity";
import { CreateExpensesInput } from "./entity/expense.input";
import { ExpenseService } from "./expense.service";

@Resolver(Expense)
export class ExpenseResolver{
    private ExpenseService: ExpenseService;
    constructor(){
        this.ExpenseService = new ExpenseService();
    }

    @Mutation(()=> String)
    async createExpenses(@Arg("input") input: CreateExpensesInput) {
        return this.ExpenseService.createExpenses(input);
    }
}