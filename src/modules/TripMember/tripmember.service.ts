import { Repository } from "typeorm";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import dataSource from "../../database/data-source";
import { TripMember } from "./entity/TripMember.entity";
import { CreateTripMembersInput, DeleteTripMemberInput, TripMemberInput } from "./tripmember.input";
import { Group } from "../Group/entity/Group.entity";
import { Trip } from "../Trip/entity/trip.entity";
import { setMailAndSend } from "../../helper/mailing/mailing";

export class TripMemberService {

    private GroupRepository: Repository<Group>;
    private GroupMemberRepository: Repository<GroupMember>;
    private TripMemberRepository: Repository<TripMember>;
    private TripRepository: Repository<Trip>;

    constructor() {
        this.GroupRepository = dataSource.getRepository(Group);
        this.TripRepository = dataSource.getRepository(Trip);
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.TripMemberRepository = dataSource.getRepository(TripMember);
    }

    async tripMember(input : TripMemberInput): Promise<TripMember> {
        try{
            const {group_member_id} = input;
            const group_member = await this.GroupMemberRepository.findOne({
                where: {member_id: group_member_id}
            });
            if(!group_member){
                throw new Error("Group not found");
            }
            const trip_member = await this.TripMemberRepository.findOne({
                where: {
                    group_member: {
                        member_id: group_member_id
                    }
                },
                relations: ["group_member"],
            });
            if(!trip_member){
                throw new Error("Trip Member not found");
            }            
            return  trip_member;
        }
        catch(err){
            console.log(err);
            throw new Error("fetching Trip Member failed "+ err);
        }
    }
    async createTripMembers(input: CreateTripMembersInput): Promise<string> {
        try {
            const { trip_id, group_id, group_members } = input;
            const group = await this.GroupRepository.findOne({
                where: { group_id: group_id }
            })
            if (!group) {
                throw new Error("Group not found");
            }
            const trip = await this.TripRepository.findOne({
                where: { trip_id: trip_id },
                relations: ["created_by", "created_by.user"]
            })
            if (!trip) {
                throw new Error("Trip not found");
            }
            for (const member_id of group_members) {
                const group_member = await this.GroupMemberRepository.findOne({
                    where: { member_id: member_id },
                    relations: ["user"]
                })
                if (!group_member) {
                    continue;
                }
                const tripMemberExists = await this.TripMemberRepository.findOne({
                    where: {
                        group_member: {
                            member_id: member_id
                        },
                        trip: {
                            trip_id: trip_id
                        }
                    },
                    withDeleted: true
                });
                if (tripMemberExists) {
                    if (tripMemberExists?.deleted_at !== null) {
                        await this.TripMemberRepository.restore(tripMemberExists?.trip_member_id);
                    }
                } else {
                    const trip_memberCreated = await this.TripMemberRepository.create({
                        group_member: group_member,
                        trip: trip
                    });
                    await this.TripMemberRepository.save(trip_memberCreated);
                }
                if (group_member?.user?.email) {
                    setMailAndSend({
                        destinationEmail: group_member?.user?.email,
                        subject: "Trip planned in Travence",
                        message:
                            `<html><h3> New Trip is planned! </h3><br>
                                <p> You are added to Trip ${trip?.trip_name}</p><br>
                                <h3>Group name: </h3><p>${group?.group_name}</p><br>
                                <h3>Planned by: </h3><p>${trip?.created_by?.user?.name}</p><br>
                            </html>  `
                    })
                }
            }
            return "Trip Members Added Successfully";
        }
        catch (err) {
            throw new Error("Inviting Group Members to join Trip failed");
        }
    }
    async deleteTripMember(input: DeleteTripMemberInput): Promise<string> {
        try{
            const {trip_member_id} = input;
            const trip_member = await this.TripMemberRepository.findOne({
                where: {trip_member_id: trip_member_id},
                relations: ["group_member", "trip"]
            })
            if(!trip_member){
                throw new Error("Trip Member not found");
            }
            const trip = await this.TripRepository.findOne({
                where: {
                    trip_id: trip_member?.trip?.trip_id,
                },
                relations: ["created_by"]
            })
            if(!trip){
                throw new Error("Trip not found");
            }else if(trip?.created_by?.member_id === trip_member?.group_member?.member_id){
                throw new Error("Access denied! because This trip is created by you");
            }
            await this.TripMemberRepository.softDelete({
                trip_member_id: trip_member_id   
            });
            return "Leave from trip Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Leaving from trip failed " + err);
        }
    }
}