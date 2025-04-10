import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GroupService } from "./group.service";
import { Group } from "./entity/Group.entity";
import { CreateGroupInput, DeleteGroupInput, GroupInput, UpdateGroupInput } from "./entity/group.input";
import { MyContext } from "../../server";

@Resolver(Group)
export class GroupResolver{

    private GroupService:GroupService;
    constructor(){
        this.GroupService = new GroupService();
    }

    @Query(()=> [Group])
    async groupList(@Ctx() ctx: MyContext) {
        return this.GroupService.groupList(ctx?.user?.user_id);
    }
    
    @Query(()=> Group)
    async group(@Arg("input") input: GroupInput){
        return this.GroupService.group(input);
    }

    @Mutation(()=> String)
    async createGroup(@Arg("input") input: CreateGroupInput) {
        return this.GroupService.createGroup(input);
    }

    @Mutation(()=> String)
    async updateGroup(@Ctx() ctx: MyContext, @Arg("input") input: UpdateGroupInput) {
        return this.GroupService.updateGroup(input, ctx?.user?.user_id);
    }
    @Mutation(()=> String)
    async deleteGroup(@Ctx() ctx: MyContext, @Arg("input") input: DeleteGroupInput){
        return this.GroupService.deleteGroup(input, ctx?.user?.user_id);
    }
    
}