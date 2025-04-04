import { Arg, Query, Resolver } from "type-graphql";
import { Trip, Trip_Status } from "./entity/trip.entity";
import { Repository } from "typeorm";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import dataSource from "../../database/data-source";
import { v4 as uuidv4 } from "uuid";
import { CreateTripInput } from "./trip.input";
import { Group } from "../Group/entity/Group.entity";

@Resolver(Trip)
export class TripResolver{

    private GroupMemberRepository: Repository<GroupMember>;
    private TripRepository: Repository<Trip>;
    private GroupRepository: Repository<Group>;

    constructor(){
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.TripRepository = dataSource.getRepository(Trip);
        this.GroupRepository = dataSource.getRepository(Group);
    }

    @Query(()=> String)   
    async getMessage(): Promise<string>{
        return "";
    }

    async createTrip(@Arg("input") input:CreateTripInput): Promise<string> {
        try{
            const {
                    group_id, 
                    admin_id, 
                    trip_name, 
                    trip_description, 
                    start_date,
                    days_count,
                    members,
                    activities,
                    checklists
                    } = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {member_id: admin_id}
            });
            if(!adminInGroup){
                throw new Error("Access denied");
            }
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_id}
            })
            if(!group){
                throw new Error("Group not found");
            }
            
            const trip = await this.TripRepository.save({
                trip_id: uuidv4(),
                trip_name: trip_name,
                trip_description: trip_description,
                trip_start_date: start_date,
                trip_days_count: days_count,
                trip_status: Trip_Status.UPCOMING,
                trip_activities: activities,
                trip_checklists: checklists,
            })
            return "Trip Created Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Creating Trip failed "+ err);
        }
    }
}