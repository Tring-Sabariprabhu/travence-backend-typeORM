import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "./entity/trip.entity";
import {  CreateTripInput, DeleteTripInput, JoinedTripsInput, TripInput, UpdateTripInput } from "./trip.input";
import { TripService } from "./trip.service";
import { TripResponse } from "./trip.response";

@Resolver(Trip)
export class TripResolver{
    private TripService: TripService;

    constructor(){
        this.TripService = new TripService();
    }

    @Query(()=> [TripResponse])
    async joinedTrips(@Arg("input")  input: JoinedTripsInput): Promise<TripResponse[]> {
        return this.TripService.joinedTrips(input);
    }
 
    @Query(()=> TripResponse)
    async trip(@Arg("input") input: TripInput): Promise<TripResponse> {
        return this.TripService.trip(input);
    }
    @Mutation(()=> String)
    async createTrip(@Arg("input") input:CreateTripInput): Promise<string> {
        return this.TripService.createTrip(input);
    }
    @Mutation(()=> String)
    async updateTrip(@Arg("input") input:UpdateTripInput): Promise<string> {
        return this.TripService.updateTrip(input);
    }

    @Mutation(()=> String)
    async deleteTrip(@Arg("input") input: DeleteTripInput): Promise<string> {
        return this.TripService.deleteTrip(input);
    }
    
}