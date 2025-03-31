import dataSource from "../../database/data-source";
import { Group } from "../Group/entity/Group.entity";
import { User } from "../User/entity/User.entity";
import { GroupMember, GroupMember_Role } from "./entity/GroupMembers.entity";
import { ChangeRoleInput, CreateGroupMemberInput, DeleteGroupMemberInput } from "./groupmember.input";
import { v4 as uuidv4 } from "uuid";


export class GroupMemberService{

    private GroupMemberRepository = dataSource.getRepository(GroupMember);
    private GroupRepository = dataSource.getRepository(Group);
    private UserRepository = dataSource.getRepository(User);

    async createMember(input: CreateGroupMemberInput): Promise<string> {
        try{
            const {group_id, user_id, user_role} = input;

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
                    // memberExist.user_role = GroupMember_Role.MEMBER;
                    // await this.GroupMemberRepository.save(memberExist);
                }
            }else{
                await this.GroupMemberRepository.save({
                    member_id: uuidv4(),
                    group: group,
                    user: user,
                    user_role: (user_role === "admin" ? GroupMember_Role.ADMIN : GroupMember_Role.MEMBER)
                });
            }
            return "Joined Group Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Joining to Group failed "+ err);
        }
    }
    async changeRole(input: ChangeRoleInput): Promise<string> {
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
            return "User role updated successfully!";
        }
        catch(err){
            console.log(err);
            throw new Error("Changing Role failed "+ err);
        }
    }
    async deleteGroupMember(input: DeleteGroupMemberInput): Promise<string>{
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