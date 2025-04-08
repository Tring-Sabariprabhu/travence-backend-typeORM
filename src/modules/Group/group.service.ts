import dataSource from "../../database/data-source";
import { Group } from "./entity/Group.entity";
import { CreateGroupInput, DeleteGroupInput, GroupInput, GroupListInput, UpdateGroupInput } from "./group.input";
import { GroupResponse } from "./group.respone";
import { GroupMember, GroupMember_Role } from "../GroupMembers/entity/GroupMembers.entity";
import { User } from "../User/entity/User.entity";
import { GroupMemberResolver } from "../GroupMembers/groupmember.resolver";
import { Repository } from "typeorm";

export class GroupService {
    
        private getGroupMemberResolver:GroupMemberResolver;
        private GroupRepository:Repository<Group>;
        private GroupMemberRepository:Repository<GroupMember>;
        private UserRepository:Repository<User>;
    
   constructor(){
        this.getGroupMemberResolver = new GroupMemberResolver();
        this.GroupRepository = dataSource.getRepository(Group);
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.UserRepository = dataSource.getRepository(User);
   }
    

    async groupList(input: GroupListInput) {
        try {
            const { user_id } = input;
            const groups = await this.GroupRepository.find(
                {
                    where: {
                        group_members: { user: { user_id } } 
                    },
                    relations: ["created_by"],
                }
            )
                
            return groups;

        }
        catch (err) {
            console.log(err);
            throw new Error("fetching Group List failed " + err);
        }
    }
    async group(input: GroupInput) {
        try {
            const { group_id } = input;
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_id},
                relations: ["group_members","created_by", "group_members.user"]
            });
            if (!group)
                throw new Error("Group not found");
            return group;
        }
        catch (err) {
            console.log(err);
            throw new Error("fetching Group data failed");
        }
    }
   
    async createGroup(input: CreateGroupInput) {
        try {
            const { created_by, group_name, group_description } = input;
            const user = await this.UserRepository.findOne(
                { where: { user_id: created_by } }
            )
            if (!user) {
                throw new Error("User not found");
            }
            const groupCreated = await this.GroupRepository.create(
                {
                    group_name: group_name,
                    group_description: group_description,
                    created_by: user
                }
            );
            if (!groupCreated)
                throw new Error("Created Group details not found");
            await this.GroupRepository.save(groupCreated);
            await this.getGroupMemberResolver.createGroupMember(
                {
                    group_id: groupCreated.group_id,
                    user_id: user.user_id,
                    user_role: GroupMember_Role.ADMIN
                });
            return "Group Created  Successfully";
        }
        catch (err) {
            console.log(err);
            throw new Error("Creating Group failed " + err);
        }
    }
    async updateGroup(input: UpdateGroupInput) {
        try{
            const {user_id, group_id, group_name, group_description} = input;
            const userExists = await this.UserRepository.findOne({
                where: {user_id: user_id}
            });
            if(!userExists){
                throw new Error("User not found");
            }
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_id},
            });
            if(!group){
                throw new Error("Group not found!");
            }
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    user: {
                        user_id: user_id
                    },
                    group: {
                        group_id: group_id
                    },
                    user_role: GroupMember_Role.ADMIN
                }
            });
            if(!adminInGroup){
                throw new Error("Access denied! Only admin can change details");
            }
            const previousGroupDetails = await this.GroupRepository.findOne({
                where: {group_id: adminInGroup?.group?.group_id}
            });
            if(!previousGroupDetails){
                throw new Error("Previous Group data not found");
            }
            previousGroupDetails.group_name = group_name;
            previousGroupDetails.group_description = group_description;
            await this.GroupRepository.save(previousGroupDetails);

            return "Group details Updated Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Updating Group details failed "+ err);
        }
    }
    async deleteGroup(input: DeleteGroupInput){
        try{
            const {user_id, group_id} = input;
            const userExists = await this.UserRepository.findOne({
                where: {user_id: user_id}
            });
            if(!userExists){
                throw new Error("User not found");
            }
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_id},
                relations: ["created_by"]
            });
            if(!group){
                throw new Error("Group not found!");
            }else if(group?.created_by?.user_id !== user_id){
                throw new Error("Access denied!");
            }
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    user: {
                        user_id: user_id
                    },
                    group: {
                        group_id: group_id
                    }
                }
            });
            if(!adminInGroup){
                throw new Error("Access denied! You are not in Group");
            }
            await this.GroupRepository.softDelete({
                group_id: group?.group_id
            })
            return "Group deleted Successfully";
        }
        catch(err){
            console.log(err);
            throw new Error("Deleting Group details failed "+err);
        }
    }
}
