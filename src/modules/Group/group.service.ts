import dataSource from "../../database/data-source";
import { Group } from "./entity/Group.entity";
import { CreateGroupInput, GroupInput, GroupListInput, UpdateGroupInput } from "./group.input";
import { GroupResponse } from "./group.respone";
import { GroupMember, GroupMember_Role } from "../GroupMembers/entity/GroupMembers.entity";
import { GroupMemberResponse } from "../GroupMembers/groupmember.response";
import { User } from "../User/entity/User.entity";
import { v4 as uuidv4 } from "uuid";
import { GroupResolver } from "./group.resolver";
import { GroupMemberResolver } from "../GroupMembers/groupmember.resolver";

export class GroupService {
    private getGroupMemberResolver = new GroupMemberResolver();

    private GroupRepository = dataSource.getRepository(Group);
    private GroupMemberRepository = dataSource.getRepository(GroupMember);
    private UserRepository = dataSource.getRepository(User);

    async groupList(input: GroupListInput): Promise<GroupResponse[]> {
        try {
            const { user_id } = input;
            const groups = await this.GroupRepository.find(
                {
                    where: {
                        group_members: { user: { user_id } } 
                    },
                    relations: ["created_by"],
                    select: {
                        group_id: true,
                        group_name: true,
                        group_description: true,
                        created_at: true,
                        deleted_at: true,
                        updated_at: true,
                        created_by: {
                            name: true,
                            email: true
                        }
                    }
                }
            )
                
            return groups;

        }
        catch (err) {
            console.log(err);
            throw new Error("fetching Group List failed " + err);
        }
    }
    async group(input: GroupInput): Promise<GroupResponse> {
        try {
            const { group_id } = input;
            const group = await this.GroupRepository.findOne({
                where: {group_id: group_id},
                relations: ["group_members","created_by"],
                select: {
                    group_id: true,
                    group_name: true,
                    group_description: true,
                    created_at: true,
                    deleted_at: true,
                    updated_at: true,
                    created_by: {
                        name: true,
                        email: true
                    },
                    group_members: {
                        member_id: true,
                        user_role: true,
                        joined_at: true,
                        deleted_at: true,
                        updated_at: true,
                        user: {
                            name: true,
                            email: true
                        }
                    }
                }
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
   
    async createGroup(input: CreateGroupInput): Promise<string> {
        try {
            const { created_by, group_name, group_description } = input;
            const user = await this.UserRepository.findOne(
                { where: { user_id: created_by } }
            )
            if (!user) {
                throw new Error("User not found");
            }
            const groupCreated = await this.GroupRepository.save(
                {
                    group_id: uuidv4(),
                    group_name: group_name,
                    group_description: group_description,
                    created_by: user
                }
            );
            if (!groupCreated)
                throw new Error("Created Group details not found");
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
    async updateGroup(input: UpdateGroupInput): Promise<string> {
        try{
            const {admin_id, group_name, group_description} = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {member_id: admin_id}
            });
            if(!adminInGroup){
                throw new Error("Access denied !");
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

}
