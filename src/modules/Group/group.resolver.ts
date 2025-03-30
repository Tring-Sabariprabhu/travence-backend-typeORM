import { Arg, Field, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { GroupService } from "./group.service";
import { Group } from "./entity/Group.entity";
import { CreateGroupInput, GroupInput, GroupListInput, UpdateGroupInput } from "./group.input";
import { GroupResponse } from "./group.respone";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";
import { User } from "../User/entity/User.entity";
import { GroupMemberResponse } from "../GroupMembers/groupmember.response";
import { GroupMemberResolver } from "../GroupMembers/groupmember.resolver";

@Resolver(Group)
export class GroupResolver{
    private GroupService = new GroupService();

    @Query(()=> [GroupResponse])
    async groupList(@Arg("input") input: GroupListInput): Promise<GroupResponse[]> {
        return this.GroupService.groupList(input);
    }
    
    @Query(()=> GroupResponse)
    async group(@Arg("input") input: GroupInput): Promise<GroupResponse>{
        return this.GroupService.group(input);
    }

    @Mutation(()=> String)
    async createGroup(@Arg("input") input: CreateGroupInput): Promise<string> {
        return this.GroupService.createGroup(input);
    }

    @Mutation(()=> String)
    async updateGroup(@Arg("input") input: UpdateGroupInput): Promise<string> {
        return this.GroupService.updateGroup(input);
    }
    
}