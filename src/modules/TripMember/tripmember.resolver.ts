import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { TripMemberService } from "./tripmember.service";
import { CreateTripMembersInput, DeleteTripMemberInput, TripMemberInput } from "./tripmember.input";
import { TripMember } from "./entity/TripMember.entity";

@Resolver()
export class TripMemberResolver{

    private TripMemberService: TripMemberService

    constructor(){
        this.TripMemberService = new TripMemberService();
       
    }
    @Mutation(()=> String)
    async createTripMembers(@Arg("input") input: CreateTripMembersInput) {
       return this.TripMemberService.createTripMembers(input);
    }
    @Mutation(()=> String)
    async deleteTripMember(@Arg("input") input: DeleteTripMemberInput) {
        return this.TripMemberService.deleteTripMember(input);
    }
    @Query(()=> TripMember)
    async tripMember(@Arg("input") input: TripMemberInput){
        return this.TripMemberService.tripMember(input);
    }
}