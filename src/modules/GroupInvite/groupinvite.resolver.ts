import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { GroupInvite } from "./entity/GroupInvites.entity";
import {  CreateGroupInviteInput, GetGroupInvitesInput, GetInvitedListInput, GroupInviteActionsInput, ResendAndDeleteGroupInvitesInput } from "./groupinvite.input";
import { GroupInviteService } from "./groupinvite.service";
import { GroupInviteResponse } from "./groupinvite.response";

@Resolver(GroupInvite)
export class GroupInviteResolver{

    private GroupInviteService:GroupInviteService;
    constructor(){
        this.GroupInviteService = new GroupInviteService();
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
    @Mutation(()=> String)
    async resendGroupInvites(@Arg("input") input: ResendAndDeleteGroupInvitesInput): Promise<string> {
        return this.GroupInviteService.resendGroupInvites(input);
    }
    @Mutation(()=> String)
    async deleteGroupInvites(@Arg("input") input: ResendAndDeleteGroupInvitesInput): Promise<string> {
        return this.GroupInviteService.deleteGroupInvites(input);
    }
    @Mutation(()=> String)
    async acceptGroupInvite(@Arg("input") input: GroupInviteActionsInput): Promise<string> {
        return this.GroupInviteService.acceptGroupInvite(input);
    }
    @Mutation(()=> String)
    async rejectGroupInvite(@Arg("input") input: GroupInviteActionsInput): Promise<string> {
        return this.GroupInviteService.rejectGroupInvite(input);
    }
}