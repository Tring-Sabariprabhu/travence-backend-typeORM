import { Arg, Query, Resolver } from "type-graphql";
import { GroupService } from "./group.service";
import { Group } from "./entity/Group.entity";
import { GroupListInput } from "./group.input";
import { GroupResponse } from "./group.respone";

@Resolver()
export class GroupResolver{
    private GroupService = new GroupService();

    @Query(()=> [GroupResponse])
    async groupList(@Arg("input") input: GroupListInput): Promise<GroupResponse[]> {
        return this.GroupService.groupList(input);
    }
    
    // @Query(()=> GroupResponse)
    // async group(@Arg("group_id") group_id: string): Promise<GroupResponse>{
    //     return this.GroupService.groupList(group_id);
    // }
}