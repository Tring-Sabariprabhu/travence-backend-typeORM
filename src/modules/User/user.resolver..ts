import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { UserService } from "./user.service";
import { SigninInput, SignupInput } from "./user.input";
import { LoginResponse } from "./user.response";
import { User } from "./entity/User.entity";
import dataSource from "../../database/data-source";

@Resolver(User)
export class UserResolver {
    private UserService = new UserService();

    @Query(()=> User)
    async getCurrentUser(@Arg("token") token: string): Promise<User>{
        return this.UserService.getCurrentUser(token);
    }
    @Mutation(() => LoginResponse)
    async signin(@Arg("input") input: SigninInput): Promise<LoginResponse> {
        return this.UserService.signin(input);
    }
    @Mutation(() => String)
    async signup(@Arg("input") input: SignupInput): Promise<string> {
        return this.UserService.signup(input);
    }
}