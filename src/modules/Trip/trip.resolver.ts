import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "./entity/trip.entity";
import {  CreateTripInput, DeleteTripInput, JoinedTripsInput, TripInput, UpdateTripInput } from "./trip.input";
import { TripService } from "./trip.service";

@Resolver(Trip)
export class TripResolver{
    private TripService: TripService;

    constructor(){
        this.TripService = new TripService();
    }

    @Query(()=> [Trip])
    async joinedTrips(@Arg("input")  input: JoinedTripsInput) {
        return this.TripService.joinedTrips(input);
    }
 
    @Query(()=> Trip)
    async trip(@Arg("input") input: TripInput) {
        return this.TripService.trip(input);
    }
    @Mutation(()=> String)
    async createTrip(@Arg("input") input:CreateTripInput){
        return this.TripService.createTrip(input);
    }
    @Mutation(()=> String)
    async updateTrip(@Arg("input") input:UpdateTripInput){
        return this.TripService.updateTrip(input);
    }

    @Mutation(()=> String)
    async deleteTrip(@Arg("input") input: DeleteTripInput) {
        return this.TripService.deleteTrip(input);
    }
    
}