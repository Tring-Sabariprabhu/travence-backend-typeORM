import dataSource from "../../database/data-source";
import { Group } from "./entity/Group.entity";
import { GroupListInput } from "./group.input";
import { GroupResponse } from "./group.respone";
import { GroupMember } from "../GroupMembers/entity/GroupMembers.entity";

export class GroupService {
    private GroupRepository = dataSource.getRepository(Group);

    async groupList(input: GroupListInput): Promise<GroupResponse[]> {
        try {
            const {user_id} = input;
            const groups = await this.GroupRepository
                .createQueryBuilder("g")
                .innerJoinAndSelect("g.created_by", "u") 
                .select([
                    "g",
                    "u.email AS created_user_email",
                    "u.name AS created_user_name"
                ])
                .where("g.group_id IN (SELECT gm.group_id FROM group_members gm WHERE gm.user_id = :user_id AND gm.deleted_at IS NULL)", { user_id })
                .getRawMany();
            return groups;

        }
        catch (err) {
            console.log(err);
            throw new Error("fetching Group List failed " + err);
        }
    }
    // async group(group_id: string): Promise<GroupResponse>{
    //     try{
    //         const gro
    //     }
    // }
}