import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { GroupMember } from "./entity/GroupMembers.entity";
import { GroupMemberService } from "./groupmember.service";
import {  CreateGroupMemberInput, GroupMemberActionsInput, GroupMemberInput } from "./groupmember.input";
import { GroupMemberResponse } from "./groupmember.response";

@Resolver(GroupMember)
export class GroupMemberResolver{

    private GroupMemberService:GroupMemberService;
    constructor(){
        this.GroupMemberService = new GroupMemberService();
    }
    @Query(()=> GroupMemberResponse)
    async groupMember(@Arg("input") input: GroupMemberInput): Promise<GroupMemberResponse> {
        return this.GroupMemberService.groupMember(input);
    }
    @Mutation(()=> String)
    async createGroupMember(@Arg("input") input: CreateGroupMemberInput): Promise<string> {
        return this.GroupMemberService.createMember(input);
    }

    @Mutation(()=> String)
    async changeRole(@Arg("input") input: GroupMemberActionsInput): Promise<string> {
        return this.GroupMemberService.changeRole(input);
    }

    @Mutation(()=> String)
    async deleteGroupMember(@Arg("input") input: GroupMemberActionsInput): Promise<string> {
        return this.GroupMemberService.deleteGroupMember(input);
    }
}