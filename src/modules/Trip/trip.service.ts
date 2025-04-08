import { Repository } from "typeorm";
import dataSource from "../../database/data-source";
import { Group } from "../Group/entity/Group.entity";
import { GroupMember, GroupMember_Role } from "../GroupMembers/entity/GroupMembers.entity";
import { Trip, Trip_Status } from "./entity/trip.entity";
import {  CreateTripInput, DeleteTripInput, JoinedTripsInput, TripInput, UpdateTripInput } from "./trip.input";
import { TripMemberResolver } from "../TripMember/tripmember.resolver";
import { TripMember } from "../TripMember/entity/TripMember.entity";


export class TripService{
    private GroupRepository: Repository<Group>;
    private GroupMemberRepository: Repository<GroupMember>;
    private TripRepository: Repository<Trip>;
    private TripMemberRepository: Repository<TripMember>;
    private TripMemberResolver: TripMemberResolver;

    constructor(){
        this.GroupRepository = dataSource.getRepository(Group);
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.TripRepository = dataSource.getRepository(Trip);
        this.TripMemberRepository = dataSource.getRepository(TripMember);
        this.TripMemberResolver = new TripMemberResolver();
    }
    async joinedTrips(input: JoinedTripsInput) {
        try{
            const { member_id , filter_type } = input;
            if(filter_type !== "all" && filter_type !== Trip_Status.PLANNED && filter_type !== Trip_Status.CANCELED && filter_type !== Trip_Status.COMPLETED){
                throw new Error("Filter type mismatched");
            }
            const member = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: member_id
                }
            })
            if(!member){
                throw new Error("Member not found in Group");
            }
            const group = await this.GroupRepository.findOne({
                where: {
                    group_id: member?.group?.group_id
                }
            });
            if(!group){
                throw new Error("Group not found");
            }
            if(filter_type === "all"){
                const trips = await this.TripRepository.find({
                    where: {
                        group: {
                            group_id: group?.group_id
                        }
                    },
                    relations: ["group", "created_by", "created_by.user"]
                })    
                return trips;
            }else{
                const trips = await this.TripRepository.find({
                    where: {
                        group: {
                            group_id: group?.group_id
                        },
                        trip_status: filter_type
                    },
                    relations: ["group", "created_by", "created_by.user"]
                })
                return trips;
            }
        }
        catch(err){
            console.log(err);
            throw new Error("fetching Trips failed "+ err);
        }
    }
    async trip(input: TripInput) {
        try{
            const { trip_id} = input;
            const trip = await this.TripRepository.findOne({
                where: {trip_id: trip_id},
                relations: [
                    "created_by", 
                    "created_by.user", 
                    "group", 
                    "trip_members", 
                    "trip_members.group_member", 
                    "trip_members.group_member.user",
                    "expense_remainders",
                    "expense_remainders.toPay",
                    "expense_remainders.paidBy",
                    "expense_remainders.toPay.group_member",
                    "expense_remainders.paidBy.group_member",
                    "expense_remainders.toPay.group_member.user",
                    "expense_remainders.paidBy.group_member.user",
                ],
            })
            if(!trip){
                throw new Error("Trip not found");
            }
            return trip;
        }
        catch(err){
            console.log(err);
            throw new Error("fetching Trip failed "+ err);
        }
    }
    async createTrip(input: CreateTripInput){
        try{
            const {
                    group_member_id, 
                    trip_name, 
                    trip_description, 
                    trip_start_date,
                    trip_days_count,
                    trip_budget,
                    trip_members,
                    trip_activities,
                    trip_checklists
                    } = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: group_member_id,}
            });
            if(!adminInGroup){
                throw new Error("Access denied");
            }else if(adminInGroup?.user_role === GroupMember_Role.MEMBER){
                throw new Error("User Role must be Admin to create Trip");
            }
            const group = await this.GroupRepository.findOne({
                where: {group_id: adminInGroup?.group?.group_id}
            })
            if(!group){
                throw new Error("Group not found");
            }
            
            const trip = await this.TripRepository.create({
                trip_name: trip_name,
                trip_description: trip_description,
                trip_start_date: trip_start_date,
                trip_days_count: trip_days_count,
                trip_budget: trip_budget,
                trip_status: Trip_Status.PLANNED,
                trip_activities: trip_activities,
                trip_checklists: trip_checklists,
                group: group,
                created_by: adminInGroup
            })
            await this.TripRepository.save(trip);
            if(!trip){
                throw new Error("Trip not found");
            }
            if(trip_members && trip_members?.length > 0){
                await this.TripMemberResolver.createTripMembers({
                    group_id: adminInGroup?.group?.group_id,
                    trip_id: trip?.trip_id,
                    group_members: trip_members
                })    
            }
            return "Trip Created Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Creating Trip failed "+ err);
        }
    }
    async updateTrip(input: UpdateTripInput) {
        try{
            const {
                    group_member_id, 
                    trip_id,
                    trip_name, 
                    trip_description, 
                    trip_start_date,
                    trip_days_count,
                    trip_budget,
                    trip_members,
                    trip_activities,
                    trip_checklists
                    } = input;
            const group_member = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: group_member_id},
                    relations: ["group"]
            });
            if(!group_member){
                throw new Error("Group Member not found");
            }
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_member?.group?.group_id}
            })
            if(!group){
                throw new Error("Group not found");
            }
            const trip = await this.TripRepository.findOne({
                where: {trip_id: trip_id},
                relations: ["created_by"]
            })
            if(!trip){
                throw new Error("Trip not found");
            }
            if(trip?.created_by?.member_id !== group_member?.member_id){
                throw new Error("Access denied! you can't delete this Trip");
            }
            trip.trip_name = trip_name;
            trip.trip_description = trip_description;
            trip.trip_start_date = trip_start_date;
            trip.trip_days_count = trip_days_count;
            trip.trip_budget = trip_budget;
            trip.trip_activities = trip_activities;
            trip.trip_checklists = trip_checklists;

            await this.TripRepository.save(trip);
            if(trip_members && trip_members?.length > 0){
                await this.TripMemberResolver.createTripMembers({
                    group_id: group_member?.group?.group_id,
                    trip_id: trip?.trip_id,
                    group_members: trip_members
                })    
            }
            return "Trip details Updated Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Updating Trip failed "+ err);
        }
    }
    async deleteTrip(input: DeleteTripInput) {
        try{
            const {group_member_id, trip_id} = input;
            const group_member = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: group_member_id,
                },
                relations: ["group"]
            })
            if(!group_member){
                throw new Error("Group Member not found");
            }
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_member?.group?.group_id}
            })
            if(!group){
                throw new Error("Group not found");
            }
            const trip = await this.TripRepository.findOne({
                where: {
                    trip_id: trip_id
                }
            })
            if(!trip){
                throw new Error("Trip not found");
            }
            const trip_member = await this.TripMemberRepository.findOne({
                where: {
                    group_member: {
                        member_id: group_member_id
                    },
                    trip: {
                        trip_id: trip_id
                    }
                },
                relations: ["group_member"]
            })
            if(trip_member?.group_member?.member_id !== group_member_id){
                throw new Error("Access denied! you can't delete this Trip");
            }
            await this.TripRepository.softDelete({
                trip_id: trip_id
            })
            return "Trip deleted Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Deleting trip failed " + err);
        }
    }
}