import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateTripMembers } from "./tripmember.input";
import dataSource from "../../database/data-source";
import { Group } from "../Group/entity/Group.entity";
import { Repository } from "typeorm";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import { TripMember } from "./entity/TripMember.entity";
import { v4 as uuidv4 } from "uuid";
import { Trip } from "../Trip/entity/trip.entity";

@Resolver()
export class TripMemberResolver{

    private GroupRepository: Repository<Group>;
    private GroupMemberRepository: Repository<GroupMember>;
    private TripMemberRepository: Repository<TripMember>;
    private TripRepository: Repository<Trip>;

    constructor(){
        this.GroupRepository = dataSource.getRepository(Group);
        this.TripRepository = dataSource.getRepository(Trip);
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.TripMemberRepository = dataSource.getRepository(TripMember);
    }
    @Mutation()
    async createTripMembers(@Arg("input") input: CreateTripMembers): Promise<string> {
        try{
            const {trip_id, group_id, members} = input;
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_id}
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
            for(const member_id of members){
                const member = await this.GroupMemberRepository.findOne({
                    where: {member_id: member_id}
                })
                if(member){
                    await this.TripMemberRepository.save({
                        trip_member_id: uuidv4(),
                        group_member: member,
                        trip: trip
                    })
                }
            }
        }
        catch(err){
            throw new Error("Inviting Group Members to join Trip failed");
        }
        return "";
    }
}