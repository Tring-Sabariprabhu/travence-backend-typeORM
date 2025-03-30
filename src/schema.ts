
import { GroupResolver } from "./modules/Group/group.resolver";
import { GroupInviteResolver } from "./modules/GroupInvite/groupinvite.resolver";
import { GroupMemberResolver } from "./modules/GroupMembers/groupmember.resolver";
import { UserResolver } from "./modules/User/user.resolver.";
import { buildSchema } from "type-graphql";

export const createSchema = () =>
    buildSchema({
        resolvers: [UserResolver, GroupResolver,GroupMemberResolver, GroupInviteResolver],
        validate: false,
    });