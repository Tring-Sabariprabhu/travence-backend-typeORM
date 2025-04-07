import { Repository } from "typeorm";
import dataSource from "../../database/data-source";
import { Group } from "../Group/entity/Group.entity";
import { GroupMember, GroupMember_Role } from "../GroupMembers/entity/GroupMembers.entity";
import { Trip, Trip_Status } from "./entity/trip.entity";
import {  CreateTripInput, JoinedTripsInput, TripInput, UpdateTripInput } from "./trip.input";
import { TripResponse } from "./trip.response";
import { TripMemberResolver } from "../TripMember/tripmember.resolver";


export class TripService{
    private GroupMemberRepository: Repository<GroupMember>;
    private TripRepository: Repository<Trip>;
    private GroupRepository: Repository<Group>;
    private TripMemberResolver: TripMemberResolver;

     constructor(){
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.TripRepository = dataSource.getRepository(Trip);
        this.GroupRepository = dataSource.getRepository(Group);
        this.TripMemberResolver = new TripMemberResolver();
    }
    async joinedTrips(input: JoinedTripsInput): Promise<TripResponse[]> {
        try{
            const { member_id } = input;
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
            const trips = await this.TripRepository.find({
                where: {group: {group_id: group?.group_id}},
                relations: ["group", "created_by", "created_by.user"]
            })
            return trips;
        }
        catch(err){
            console.log(err);
            throw new Error("fetching Trips failed "+ err);
        }
    }
    async trip(input: TripInput): Promise<TripResponse> {
        try{
            const {member_id, trip_id} = input;
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
            const trip = await this.TripRepository.findOne({
                where: {trip_id: trip_id},
                relations: [
                    "created_by", 
                    "created_by.user", 
                    "group", 
                    "trip_members", 
                    "trip_members.group_member", 
                    "trip_members.group_member.user"],
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
    async createTrip(input: CreateTripInput): Promise<string> {
        try{
            const {
                    admin_id, 
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
                    member_id: admin_id,}
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
                trip_status: Trip_Status.UPCOMING,
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
                const trip_members_adding = await this.TripMemberResolver.createTripMembers({
                    group_id: adminInGroup?.group?.group_id,
                    trip_id: trip?.trip_id,
                    group_members: trip_members
                })    
                return trip_members_adding;
            }
            return "Trip Created Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Creating Trip failed "+ err);
        }
    }
    async updateTrip(input: UpdateTripInput): Promise<string> {
        try{
            const {
                    admin_id, 
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
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: admin_id,}
            });
            if(!adminInGroup){
                throw new Error("Access denied");
            }else if(adminInGroup?.user_role === GroupMember_Role.MEMBER){
                throw new Error("User Role must be Admin to edit Trip");
            }
            const group = await this.GroupRepository.findOne({
                where: {group_id: adminInGroup?.group?.group_id}
            })
            if(!group){
                throw new Error("Group not found");
            }
            const trip = await this.TripRepository.findOne({
                where: {trip_id: trip_id}
            })
            if(!trip){
                throw new Error("Trip not found");
            }
            if(trip_members && trip_members?.length > 0){
                const trip_members_adding = await this.TripMemberResolver.createTripMembers({
                    group_id: adminInGroup?.group?.group_id,
                    trip_id: trip?.trip_id,
                    group_members: trip_members
                })    
                return trip_members_adding;
            }
            return "Trip Created Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Creating Trip failed "+ err);
        }
    }
}