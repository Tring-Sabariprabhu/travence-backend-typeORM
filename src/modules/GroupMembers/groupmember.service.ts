import { Repository } from "typeorm";
import dataSource from "../../database/data-source";
import { Group } from "../Group/entity/Group.entity";
import { User } from "../User/entity/User.entity";
import { GroupMember, GroupMember_Role } from "./entity/GroupMembers.entity";
import {  CreateGroupMemberInput, GroupMemberActionsInput, GroupMemberInput, GroupMembersForTripInput } from "./entity/groupmember.input";
import { GroupInput } from "../Group/entity/group.input";
import { Trip } from "../Trip/entity/trip.entity";


export class GroupMemberService{

        private GroupMemberRepository:Repository<GroupMember>;
        private GroupRepository:Repository<Group>;
        private UserRepository:Repository<User>;
        private TripRepository: Repository<Trip>;

    constructor(){
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.GroupRepository = dataSource.getRepository(Group);
        this.UserRepository = dataSource.getRepository(User);
        this.TripRepository = dataSource.getRepository(Trip);
    }
     
    async groupMembers(input: GroupInput){
        try{
            const {group_id} = input;
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_id}
            })
            if(!group){
                throw new Error("Group not found");
            }
            const group_members = await this.GroupMemberRepository.find({
                where: {
                    group: {
                        group_id: group_id
                    }
                },
                relations: ["user"]
            });
            if(!group_members){
                throw new Error("Group Members not found");
            }
            return group_members;
        }
        catch(err){
            throw new Error("fecthing Group members failed "+ err);
        }
    }
    async groupMember(input: GroupMemberInput, user_id: string){
            try {
                const { group_id} = input;
                const user = await this.UserRepository.findOne({
                    where: {user_id: user_id}
                });
                if(!user){
                    throw new Error("User not found");
                }
                const group = await this.GroupRepository.findOne({
                    where: {group_id: group_id}
                })
                if(!group){
                    throw new Error("Group not found");
                }
                const group_member = await this.GroupMemberRepository.findOne({
                    where: {
                        user: {
                            user_id: user_id
                        },
                        group: {
                            group_id: group_id
                        }
                    },
                    relations: ["user"]
                });
                if(!group_member){
                    throw new Error("Group Member not found");
                }
                return group_member;
            }
            catch (err) {
                console.log(err);
                throw new Error("fetching Group member failed "+ err);
            }
        }
    async groupMembersForTrip(input: GroupMembersForTripInput){
        try{
            const {group_id, trip_id} = input;   
            if(!group_id && !trip_id){
                throw new Error("Input is required");
            }
            if(group_id){
                console.log("Group  " + group_id)
                const group = await this.GroupRepository.findOne({
                    where: {
                        group_id: group_id
                    }
                });
                if(!group){
                    throw new Error("Group not found");
                }
                const group_members = await this.GroupMemberRepository.query(`
                    SELECT gm.member_id as member_id, u.name as name FROM group_members gm
                        INNER JOIN users u 
                        ON u.user_id = gm.user_id 
                    WHERE gm.group_id = $1 AND gm.deleted_at IS NULL`,[group_id]);
                return group_members;
            }else {
                const trip = await this.TripRepository.findOne({
                    where: {
                        trip_id: trip_id
                    },
                    relations: ["group"]
                });
                console.log("Trip  " + trip_id)
                console.log(trip?.group?.group_id)
                if(!trip){
                    throw new Error("Trip not found");
                };
                const group_members = await this.GroupMemberRepository.query(
                    `SELECT gm.member_id as member_id, u.name as name FROM group_members gm
                        INNER JOIN users u 
                        ON u.user_id = gm.user_id 
                    WHERE gm.group_id = $1 
                        AND member_id NOT IN (SELECT group_member_id FROM trip_members WHERE trip_id = $2 AND deleted_at IS NULL) 
                        AND gm.deleted_at IS NULL`,[trip?.group?.group_id, trip_id]
                )
                return group_members;
            }
        }
        catch(err){
            throw new Error("fetching Group Members failed "+err);
        }
    }
    async createGroupMember(input: CreateGroupMemberInput, user_id: string){
        try{
            const {group_id, user_role} = input;

            const group = await this.GroupRepository.findOne({
                where: {group_id : group_id},
            });
            if(!group){
                throw new Error("Group not found");
            }
            const user = await this.UserRepository.findOne({
                where: {user_id : user_id},
            });
            if(!user){
                throw new Error("User not found");
            }
            const memberExist = await this.GroupMemberRepository.findOne(
                {
                    where: {group: {group_id: group_id}, user: {user_id: user_id}},
                    withDeleted: true
                    }
            )
            if(memberExist){
                if(memberExist?.deleted_at === null){
                    throw new Error("Member already Exist");
                }else{
                    await this.GroupMemberRepository.restore(memberExist?.member_id);
                }
            }else{
                const groupMember = await this.GroupMemberRepository.create({
                    group: group,
                    user: user,
                    user_role: (user_role === "admin" ? GroupMember_Role.ADMIN : GroupMember_Role.MEMBER)
                });
                await this.GroupMemberRepository.save(groupMember);
            }
            return "Joined Group Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Joining to Group failed "+ err);
        }
    }
    async changeRole(input: GroupMemberActionsInput) {
        try{
            const {admin_id, member_id} = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: admin_id,
                    user_role: GroupMember_Role.ADMIN}
            })
            if(!adminInGroup){
                throw new Error("Access denied !");
            }
            const member = await this.GroupMemberRepository.findOne({
                where: {member_id: member_id}
            })
            if(!member){
                throw new Error("User not found");
            }
            member.user_role = member.user_role === GroupMember_Role.ADMIN ? GroupMember_Role.MEMBER : GroupMember_Role.ADMIN; 
            await this.GroupMemberRepository.save(member);
            return "User role updated Successfully!";
        }
        catch(err){
            console.log(err);
            throw new Error("Changing Role failed "+ err);
        }
    }
    async deleteGroupMember(input: GroupMemberActionsInput){
        try{
            const {admin_id, member_id} = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: admin_id,
                    user_role: GroupMember_Role.ADMIN}
            })
            if(!adminInGroup){
                throw new Error("Access denied !");
            }
            const member = await this.GroupMemberRepository.findOne({
                where: {member_id: member_id}
            })
            if(!member){
                throw new Error("User not found");
            }
            await this.GroupMemberRepository.softDelete({
                member_id: member_id
            });
            return "User deleted from Group Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Removing User from group failed " + err);
        }
    }
}