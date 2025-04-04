import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { UserService } from "./user.service";
import { SigninInput, SignupInput, UpdateUserInput } from "./user.input";
import { LoginResponse } from "./user.response";
import { User } from "./entity/User.entity";

@Resolver(User)
export class UserResolver {
    
    private userService:UserService;

    constructor(){
        this.userService = new UserService();
    }
    
    
    @Query(()=> User)
    async getCurrentUser(@Arg("token") token: string): Promise<User>{
        return this.userService.getCurrentUser(token);
    }
    @Mutation(() => LoginResponse)
    async signin(@Arg("input") input: SigninInput): Promise<LoginResponse> {
        return this.userService.signin(input);
    }
    @Mutation(() => String)
    async signup(@Arg("input") input: SignupInput): Promise<string> {
        return this.userService.signup(input);
    }
    @Mutation(()=> String)
    async updateUser(@Arg("input") input: UpdateUserInput): Promise<string> {
        return this.userService.updateUser(input);
    }
}