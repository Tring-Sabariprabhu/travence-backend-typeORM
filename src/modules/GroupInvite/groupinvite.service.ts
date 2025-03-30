import dataSource from "../../database/data-source"
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import { User } from "../User/entity/User.entity";
import { GroupInvite, Invite_Status } from "./entity/GroupInvites.entity"
import {  CreateGroupInviteInput, GetGroupInvitesInput, GetInvitedListInput, GroupInviteActionsInput } from "./groupinvite.input";
import {v4 as uuidv4} from "uuid";
import { GroupInviteResponse } from "./groupinvite.response";
import { GroupMemberResolver } from "../GroupMembers/groupmember.resolver";

export class GroupInviteService{
    private GroupInviteRepository = dataSource.getRepository(GroupInvite);
    private GroupMemberRepository = dataSource.getRepository(GroupMember);
    private UserRepository = dataSource.getRepository(User);

    private getGroupMemberResolver = new GroupMemberResolver();

    async createGroupInvites(input: CreateGroupInviteInput): Promise<string> {
        try{
            const {invited_by, emails} = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {member_id: invited_by},
            })
            if(adminInGroup === null){
                throw new Error("Access denied !");
            }
            for(const email of emails){
                const userExist = await this.UserRepository.findOne({
                    where: {email: email },
                })
                const registered = userExist ? true : false;
                await this.GroupInviteRepository.save({
                    invite_id: uuidv4(),
                    invited_by: adminInGroup,
                    email: email,
                    registered_user: registered,
                    invite_status: Invite_Status.INVITED
                })
            }
            return "Invite Sent Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Inviting User failed "+ err);
        }
    }
    async getGroupInvitedList(input: GetInvitedListInput): Promise<GroupInviteResponse[]> {
        try{
            const {admin_id} = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {member_id: admin_id}
            })
            if(!adminInGroup){
                throw new Error("Access denied !");
            }
            const invitedList = await this.GroupInviteRepository.find({
                where: {invited_by: {member_id: admin_id}},
                relations: ["invited_by"],
                select:{
                    invite_id: true,
                    email: true,
                    registered_user: true,
                    invite_status: true,
                    invited_at: true,
                    invited_by:{
                        member_id: true,
                        group:{
                            group_name: true,
                            group_description: true
                        },
                        user: {
                            name: true,
                            email: true
                        }
                    }
                }
            });
            return invitedList;
        }
        catch(err){
            console.log(err);
            throw new Error("fetching Invited List failed "+ err);
        }
    }
    async getGroupInvites(input: GetGroupInvitesInput): Promise<GroupInviteResponse[]>{
        try{
            const {email} = input;
            const userExist = await this.UserRepository.findOne({
                where: {email: email}
            });
            if(!userExist){
                throw new Error("User not found");
            }
            const invites = await this.GroupInviteRepository.find({
                where: {email: email},
                relations: ["invited_by"],
                select:{
                    invite_id: true,
                    email: true,
                    registered_user: true,
                    invite_status: true,
                    invited_at: true,
                    invited_by:{
                        member_id: true,
                        group:{
                            group_name: true,
                            group_description: true
                        },
                        user: {
                            name: true,
                            email: true
                        }
                    }
                }
            });
            return invites;
        }
        catch(err){
            console.log(err);
            throw new Error("fetching Group Invites failed "+ err);
        }
    }
    // async acceptGroupInvite(input: GroupInviteActionsInput): Promise<string> {
    //     try{
    //         const {admin_id, invite_id} = input;
    //         const adminInGroup = await this.GroupMemberRepository.findOne({
    //             where: {member_id: admin_id}
    //         })
    //         if(!adminInGroup){
    //             throw new Error("Access denied !");
    //         }
    //         const invite = await this.GroupInviteRepository.findOne({
    //             where: {invite_id: invite_id}
    //         });
    //         if(invite){
    //             throw new Error("Invite not found");
    //         }
    //         await this.getGroupMemberResolver.createGroupMember({group_id: adminInGroup?.group?.group_id, user_id: in})
    //     }
    //     catch(err){
    //         console.log(err);
    //         throw new Error("Accept Group Invite failed "+ err);
    //     }
    // }
    // async declineGroupInvite(input: GroupInviteActionsInput): Promise<string> {
    //     try{
    //         const {admin_id, invite_id} = input;
    //         return "";
    //     }
    //     catch(err){
    //         console.log(err);
    //         throw new Error("Decline Group Invite failed "+ err);
    //     }
    // }
}