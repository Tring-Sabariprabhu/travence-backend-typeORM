
import { GroupResolver } from "./modules/Group/group.resolver";
import { UserResolver } from "./modules/User/user.resolver.";
import { buildSchema } from "type-graphql";

export const createSchema = () =>
    buildSchema({
        resolvers: [UserResolver, GroupResolver],
        validate: false,
    });