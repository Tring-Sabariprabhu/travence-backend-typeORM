import { Repository } from "typeorm";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import dataSource from "../../database/data-source";
import { TripMember } from "./entity/TripMember.entity";
import { CreateTripMembersInput } from "./tripmember.input";
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
                where: { trip_id: trip_id }
            })
            if (!trip) {
                throw new Error("Trip not found");
            }
            for (const member_id of group_members) {
                const member = await this.GroupMemberRepository.findOne({
                    where: { member_id: member_id }
                })
                if (member) {
                    await this.TripMemberRepository.save({
                        group_member: member,
                        trip: trip
                    })
                }
                const email = member?.user?.email;
                if(email){
                    setMailAndSend({
                        destinationEmail: email,
                        subject: "Trip plannednp in Travence",
                        message: 
                            `<html><h3> New Trip is planned! </h3><br>
                                <p> You added to Trip ${trip?.trip_name}</p><br>
                                <h3>Group name: </h3><p>${trip?.group?.group_name}</p><br>
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
}