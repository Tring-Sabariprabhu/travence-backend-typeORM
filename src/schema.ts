
import { GroupResolver } from "./modules/Group/group.resolver";
import { GroupInviteResolver } from "./modules/GroupInvite/groupinvite.resolver";
import { GroupMemberResolver } from "./modules/GroupMembers/groupmember.resolver";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./modules/User/user.resolver";
import { TripResolver } from "./modules/Trip/trip.resolver";
import { TripMemberResolver } from "./modules/TripMember/tripmember.resolver";

export const createSchema = () =>
    buildSchema({
        resolvers: [UserResolver, GroupResolver,GroupMemberResolver, GroupInviteResolver, TripResolver, TripMemberResolver],
        validate: false,
    });