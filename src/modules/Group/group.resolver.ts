import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { GroupService } from "./group.service";
import { Group } from "./entity/Group.entity";
import { CreateGroupInput, DeleteGroupInput, GroupInput, GroupListInput, UpdateGroupInput } from "./group.input";
import { GroupResponse } from "./group.respone";

@Resolver(Group)
export class GroupResolver{

    private GroupService:GroupService;
    constructor(){
        this.GroupService = new GroupService();
    }

    @Query(()=> [GroupResponse])
    async groupList(@Arg("input") input: GroupListInput) {
        return this.GroupService.groupList(input);
    }
    
    @Query(()=> GroupResponse)
    async group(@Arg("input") input: GroupInput){
        return this.GroupService.group(input);
    }

    @Mutation(()=> String)
    async createGroup(@Arg("input") input: CreateGroupInput) {
        return this.GroupService.createGroup(input);
    }

    @Mutation(()=> String)
    async updateGroup(@Arg("input") input: UpdateGroupInput) {
        return this.GroupService.updateGroup(input);
    }
    @Mutation(()=> String)
    async deleteGroup(@Arg("input") input: DeleteGroupInput){
        return this.GroupService.deleteGroup(input);
    }
    
}