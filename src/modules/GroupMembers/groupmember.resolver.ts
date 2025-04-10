import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GroupMember } from "./entity/GroupMembers.entity";
import { GroupMemberService } from "./groupmember.service";
import {  CreateGroupMemberInput, GroupMemberActionsInput, GroupMemberInput, GroupMembersForTripInput } from "./entity/groupmember.input";
import { GroupInput } from "../Group/entity/group.input";
import { MyContext } from "../../server";
import { GroupMembersForTrip } from "./groupmember.response";

@Resolver(GroupMember)
export class GroupMemberResolver{

    private GroupMemberService:GroupMemberService;
    constructor(){
        this.GroupMemberService = new GroupMemberService();
    }
    @Query(()=> [GroupMembersForTrip])
    async groupMembersForTrip(@Arg("input") input: GroupMembersForTripInput){
       return this.GroupMemberService.groupMembersForTrip(input);
    }
    @Query(()=> [GroupMember])
    async groupMembers(@Arg("input") input: GroupInput) {
        return this.GroupMemberService.groupMembers(input);
    }
    @Query(()=> GroupMember)
    async groupMember(@Ctx() ctx: MyContext, @Arg("input") input: GroupMemberInput) {
        return this.GroupMemberService.groupMember(input, ctx?.user?.user_id);
    }
    @Mutation(()=> String)
    async createGroupMember(@Ctx() ctx: MyContext, @Arg("input") input: CreateGroupMemberInput) {
        return this.GroupMemberService.createGroupMember(input, ctx?.user?.user_id);
    }

    @Mutation(()=> String)
    async changeRole(@Arg("input") input: GroupMemberActionsInput) {
        return this.GroupMemberService.changeRole(input);
    }

    @Mutation(()=> String)
    async deleteGroupMember(@Arg("input") input: GroupMemberActionsInput) {
        return this.GroupMemberService.deleteGroupMember(input);
    }
}