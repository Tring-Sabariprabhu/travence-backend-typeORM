import dataSource from "../../database/data-source"
import { GroupMember, GroupMember_Role } from "../GroupMembers/entity/GroupMembers.entity";
import { User } from "../User/entity/User.entity";
import { GroupInvite, Invite_Status } from "./entity/GroupInvites.entity"
import { 
    GetInvitedListInput, 
    GetGroupInvitesInput, 
    CreateGroupInviteInput, 
    GroupInviteActionsInput,
    ResendAndDeleteGroupInvitesInput} from "./groupinvite.input"; 
import { v4 as uuidv4 } from "uuid";
import { GroupInviteResponse } from "./groupinvite.response";
import { GroupMemberResolver } from "../GroupMembers/groupmember.resolver";
import { Repository } from "typeorm";

export class GroupInviteService {
    private GroupInviteRepository:Repository<GroupInvite>;
    private GroupMemberRepository:Repository<GroupMember>;
    private UserRepository:Repository<User>;
    private getGroupMemberResolver:GroupMemberResolver;
   constructor(){
        this.GroupInviteRepository = dataSource.getRepository(GroupInvite);
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.UserRepository = dataSource.getRepository(User);
        this.getGroupMemberResolver = new GroupMemberResolver();
   }

    async createGroupInvites(input: CreateGroupInviteInput): Promise<string> {
        try {
            const { invited_by, emails } = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: { 
                    member_id: invited_by,
                    user_role: GroupMember_Role.ADMIN},
            })
            if (adminInGroup === null) {
                throw new Error("Access denied !");
            }
            for (const email of emails) {
                const userExist = await this.UserRepository.findOne({
                    where: { email: email },
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
            return "Invites Sent Successfully";
        }
        catch (err) {
            console.log(err);
            throw new Error("Inviting User failed " + err);
        }
    }
    async resendGroupInvites(input: ResendAndDeleteGroupInvitesInput): Promise<string> {
        try{
            const {invited_by, invites} = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: { 
                    member_id: invited_by,
                    user_role: GroupMember_Role.ADMIN }
            });
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            for(const invite_id of invites){
                const inviteDetails = await this.GroupInviteRepository.findOne({
                    where: {invite_id: invite_id}
                });
                if(!inviteDetails){
                    continue;
                }
                const userExist = await this.UserRepository.findOne({
                    where: {email: inviteDetails.email}
                });
                const registered = userExist ? true : false; 
                await this.GroupInviteRepository.update(
                    {
                        invite_id: invite_id
                    },
                    {
                        registered_user: registered,
                        invite_status: Invite_Status.INVITED,
                        invited_at: new Date(),
                    },
                )
            }
            return "Invites Resent Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Resending Invites failled "+ err);
        }
    }
    async deleteGroupInvites(input: ResendAndDeleteGroupInvitesInput): Promise<string> {
        try{
            const {invited_by, invites} = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: { 
                    member_id: invited_by,
                    user_role: GroupMember_Role.ADMIN }
            });
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            for(const invite_id of invites){
                await this.GroupInviteRepository.delete(
                    {invite_id: invite_id}
                );
            }
            return "Invites deleted Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Invites deleted failed "+ err);
        }
    }
    async getGroupInvitedList(input: GetInvitedListInput): Promise<GroupInviteResponse[]> {
        try {
            const { admin_id } = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: { 
                    member_id: admin_id,
                    user_role: GroupMember_Role.ADMIN }
            })
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            const invitedList = await this.GroupInviteRepository.find({
                where: { invited_by: { member_id: admin_id } },
                relations: ["invited_by"],
                select: {
                    invite_id: true,
                    email: true,
                    registered_user: true,
                    invite_status: true,
                    invited_at: true,
                    invited_by: {
                        member_id: true,
                        group: {
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
        catch (err) {
            console.log(err);
            throw new Error("fetching Invited List failed " + err);
        }
    }
    async getGroupInvites(input: GetGroupInvitesInput): Promise<GroupInviteResponse[]> {
        try {
            const { email } = input;
            const userExist = await this.UserRepository.findOne({
                where: { email: email, }
            });
            if (!userExist) {
                throw new Error("User not found");
            }
            const invites = await this.GroupInviteRepository.find({
                where: {
                    email: email,
                    invite_status: Invite_Status.INVITED
                },
                relations: ["invited_by"],
                select: {
                    invite_id: true,
                    email: true,
                    registered_user: true,
                    invite_status: true,
                    invited_at: true,
                    invited_by: {
                        member_id: true,
                        group: {
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
        catch (err) {
            console.log(err);
            throw new Error("fetching Group Invites failed " + err);
        }
    }
    async acceptGroupInvite(input: GroupInviteActionsInput): Promise<string> {
        try{
            const {invite_id} = input;
            const inviteDetails = await this.GroupInviteRepository.findOne({
                where: {invite_id: invite_id}
            });
            if(!inviteDetails){
                throw new Error("Invite Details not found");
            }
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: inviteDetails?.invited_by?.member_id,
                    user_role: GroupMember_Role.ADMIN}
            })
            if(!adminInGroup){
                throw new Error("Access denied !");
            }
            const user = await this.UserRepository.findOne({
                where: {email: inviteDetails?.email }
            })
            if(!user){
                throw new Error("User not found");
            }
            const joinedMessage = await this.getGroupMemberResolver.createGroupMember(
                {
                    group_id: adminInGroup?.group?.group_id, 
                    user_id: user.user_id, 
                    user_role: GroupMember_Role.MEMBER
                    });
            await this.deleteGroupInvites(
                {
                    invited_by: inviteDetails?.invited_by?.member_id, 
                    invites: [invite_id], 
                    })
            return joinedMessage;
        }
        catch(err){
            console.log(err);
            throw new Error("Accept Group Invite failed "+ err);
        }
    }
    async rejectGroupInvite(input: GroupInviteActionsInput): Promise<string> {
        try{
            const {invite_id} = input;
            const inviteDetails = await this.GroupInviteRepository.findOne({
                where: {invite_id: invite_id}
            });
            if(!inviteDetails){
                throw new Error("Invite Details not found");
            }
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: inviteDetails?.invited_by?.member_id,
                    user_role: GroupMember_Role.ADMIN}
            })
            if(!adminInGroup){
                throw new Error("Access denied !");
            }
            await this.GroupInviteRepository.update(
                {invite_id: invite_id}, 
                {invite_status: Invite_Status.REJECTED});    
            return "Invite Rejected Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Decline Group Invite failed "+ err);
        }
    }
}