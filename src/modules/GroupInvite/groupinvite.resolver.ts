import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { GroupInvite } from "./entity/GroupInvites.entity";
import {  CreateGroupInviteInput, GetGroupInvitesInput, GetInvitedListInput, GroupInviteActionsInput } from "./groupinvite.input";
import { GroupInviteService } from "./groupinvite.service";
import { GroupInviteResponse } from "./groupinvite.response";

@Resolver(GroupInvite)
export class GroupInviteResolver{

    private GroupInviteService = new GroupInviteService();

    @Query(()=> String)
    async getQuery(): Promise<string>{
        return "Hi";
    }
    
    @Query(()=> [GroupInviteResponse])
    async getGroupInvitedList(@Arg("input") input: GetInvitedListInput): Promise<GroupInviteResponse[]> {
        return this.GroupInviteService.getGroupInvitedList(input);
    }

    @Query(()=> [GroupInviteResponse])
    async getGroupInvites(@Arg("input") input: GetGroupInvitesInput): Promise<GroupInviteResponse[]> {
        return this.GroupInviteService.getGroupInvites(input);
    }

    @Mutation(()=> String)
    async createGroupInvites(@Arg("input") input: CreateGroupInviteInput): Promise<string> {
        return this.GroupInviteService.createGroupInvites(input);
    }
    
    // @Mutation(()=> String)
    // async acceptGroupInvite(@Arg("input") input: GroupInviteActionsInput): Promise<string> {
    //     return this.GroupInviteService.acceptGroupInvite(input);
    // }
    // @Mutation(()=> String)
    // async declineGroupInvite(@Arg("input") input: GroupInviteActionsInput): Promise<string> {
    //     return this.GroupInviteService.declineGroupInvite(input);
    // }
}