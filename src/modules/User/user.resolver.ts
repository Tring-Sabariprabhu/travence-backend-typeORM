import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserService } from "./user.service";
import { SigninInput, SignupInput, UpdateUserInput } from "./user.input";
import { LoginResponse } from "./user.response";
import { User } from "./entity/User.entity";
import { MyContext } from "../../server";

@Resolver(User)
export class UserResolver {
    
    private userService:UserService;

    constructor(){
        this.userService = new UserService();
    }
    
    @Query(()=> User)
    async getCurrentUser(@Ctx() ctx: MyContext){
        return this.userService.getCurrentUser(ctx);
    }
    @Mutation(() => LoginResponse)
    async signin(@Arg("input") input: SigninInput) {
        return this.userService.signin(input);
    }
    @Mutation(() => String)
    async signup(@Arg("input") input: SignupInput) {
        return this.userService.signup(input);
    }
    @Mutation(()=> String)
    async updateUser(@Arg("input") input: UpdateUserInput) {
        return this.userService.updateUser(input);
    }
}