import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { GroupMember } from "./entity/GroupMembers.entity";
import { GroupMemberService } from "./groupmember.service";
import { ChangeRoleInput, CreateGroupMemberInput, DeleteGroupMemberInput } from "./groupmember.input";

@Resolver(GroupMember)
export class GroupMemberResolver{

    private GroupMemberService = new GroupMemberService();

    @Query(()=> String)
    async getMessage(): Promise<string> {
        return "Hi";
    }
    @Mutation(()=> String)
    async createGroupMember(@Arg("input") input: CreateGroupMemberInput): Promise<string> {
        return this.GroupMemberService.createMember(input);
    }

    @Mutation(()=> String)
    async changeRole(@Arg("input") input: ChangeRoleInput): Promise<string> {
        return this.GroupMemberService.changeRole(input);
    }

    @Mutation(()=> String)
    async deleteGroupMember(@Arg("input") input: DeleteGroupMemberInput): Promise<string> {
        return this.GroupMemberService.deleteGroupMember(input);
    }
}