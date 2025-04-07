import { Arg, Mutation, Resolver } from "type-graphql";
import { TripMemberService } from "./tripmember.service";
import { CreateTripMembersInput } from "./tripmember.input";

@Resolver()
export class TripMemberResolver{

    private TripMemberService: TripMemberService

    constructor(){
        this.TripMemberService = new TripMemberService();
       
    }
    @Mutation(()=> String)
    async createTripMembers(@Arg("input") input: CreateTripMembersInput): Promise<string> {
       return this.TripMemberService.createTripMembers(input);
    }
}