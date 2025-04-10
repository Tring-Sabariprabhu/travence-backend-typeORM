import dataSource from "../../database/data-source"
import { GroupMember, GroupMember_Role } from "../GroupMembers/entity/GroupMembers.entity";
import { User } from "../User/entity/User.entity";
import { GroupInvite, Invite_Status } from "./entity/GroupInvites.entity";
import {
    GetInvitedListInput,
    GetGroupInvitesInput,
    CreateGroupInviteInput,
    GroupInviteActionsInput,
    ResendAndDeleteGroupInvitesInput,
    GroupInviteInput
} from "./entity/groupinvite.input";
import { GroupMemberResolver } from "../GroupMembers/groupmember.resolver";
import { Repository } from "typeorm";
import { setMailAndSend } from "../../helper/mailing/mailing";
import dotenv from 'dotenv';
import { GroupMemberService } from "../GroupMembers/groupmember.service";
dotenv.config();

export class GroupInviteService {
    private GroupInviteRepository: Repository<GroupInvite>;
    private GroupMemberRepository: Repository<GroupMember>;
    private UserRepository: Repository<User>;
    private GroupMemberService: GroupMemberService;
    constructor() {
        this.GroupInviteRepository = dataSource.getRepository(GroupInvite);
        this.GroupMemberRepository = dataSource.getRepository(GroupMember);
        this.UserRepository = dataSource.getRepository(User);
        this.GroupMemberService = new GroupMemberService();
    }
    async getGroupInvite(input: GroupInviteInput) {
        const { email, admin_id } = input;
        const adminInGroup = await this.GroupMemberRepository.findOne({
            where: {
                member_id: admin_id,
                user_role: GroupMember_Role.ADMIN
            }
        })
        if (!adminInGroup) {
            throw new Error("Access denied !");
        }
        const invite = await this.GroupInviteRepository.findOne({
            where: {
                invited_by: {
                    member_id: admin_id
                },
                email: email
            },
        });
        if (!invite) {
            throw new Error("Invite not found");
        }
        return invite;
    }
    async getGroupInvitedListCount(admin_id: string) {
        try {
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: admin_id,
                    user_role: GroupMember_Role.ADMIN
                }
            })
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            const listCount = await this.GroupInviteRepository.count({
                where: { invited_by: { member_id: admin_id } },
            });
            return listCount;
        }
        catch (err) {
            throw new Error("fetching Count failed" + err);
        }
    }
    async getGroupInvitedList(input: GetInvitedListInput) {
        try {
            const { admin_id, limit, offset } = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: admin_id,
                    user_role: GroupMember_Role.ADMIN
                }
            })
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            const invitedList = await this.GroupInviteRepository.find({
                where: { invited_by: { member_id: admin_id } },
                take: limit,
                skip: offset,
                order: { invited_at: "ASC" },
            });
            return invitedList;
        }
        catch (err) {
            console.log(err);
            throw new Error("fetching Invited List failed " + err);
        }
    }
    async getGroupInvites(input: GetGroupInvitesInput) {
        try {
            const { email } = input;
            const userExist = await this.UserRepository.findOne({
                where: { email: email, }
            });
            if (!userExist) {
                throw new Error("User not found");
            }
            const invites = await this.GroupInviteRepository.find({
                where: {
                    email: email,
                    invite_status: Invite_Status.INVITED
                },
                relations: ["invited_by", "invited_by.group", "invited_by.user"],
            });
            return invites;
        }
        catch (err) {
            console.log(err);
            throw new Error("fetching Group Invites failed " + err);
        }
    }
    async createGroupInvites(input: CreateGroupInviteInput) {
        try {
            const { invited_by, emails } = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: invited_by,
                    user_role: GroupMember_Role.ADMIN
                },
                relations: ["group", "user"]
            })
            if (adminInGroup === null) {
                throw new Error("Access denied !");
            }
            let sentCount = 0;
            for (const email of emails) {
                const inviteExists = await this.GroupInviteRepository.findOne({
                    where: {
                        invited_by:
                        {
                            member_id: adminInGroup?.member_id,
                        },
                        email: email
                    }
                })
                if (inviteExists) {
                    continue;
                }
                const group_member_Exist = await this.GroupMemberRepository.findOne({
                    where: {
                        user: {
                            email: email
                        },
                        group: {
                            group_id: adminInGroup?.group?.group_id
                        }
                    }
                })
                if (group_member_Exist) {
                    continue;
                }
                const userExist = await this.UserRepository.findOne({
                    where: { email: email },
                })
                const registered = userExist ? true : false;
                const groupInvite = await this.GroupInviteRepository.create({
                    invited_by: adminInGroup,
                    email: email,
                    registered_user: registered,
                    invite_status: Invite_Status.INVITED
                })
                await this.GroupInviteRepository.save(groupInvite);
                const invited_by = adminInGroup?.user?.name;
                const group_name = adminInGroup?.group?.group_name;
                setMailAndSend(
                    {
                        destinationEmail: email,
                        subject: "Invite to Join Group in Travence",
                        message:
                            `<html><p>You have been invited by ${invited_by} to join the group "${group_name}" on Travence!</p><br>
                            <p>Click the link and Login with Travence</p><br>` +
                            (registered ?
                                `<a href="${process.env.SIGNIN_URL}">Login Here</a></html>`
                                :
                                `<a href="${process.env.SIGNUP_URL}">Sign Up Here</a>`
                            )

                    });
                sentCount++;
            }
            if (sentCount < 1) {
                throw new Error("No Invite Send");
            }
            return "Invites Sent Successfully";
        }
        catch (err) {
            console.log(err);
            throw new Error("Inviting User failed " + err);
        }
    }
    async resendGroupInvites(input: ResendAndDeleteGroupInvitesInput) {
        try {
            const { invited_by, invites } = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: invited_by,
                    user_role: GroupMember_Role.ADMIN
                },
                relations: ["group", "user"]
            });
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            for (const invite_id of invites) {
                const inviteDetails = await this.GroupInviteRepository.findOne({
                    where: { invite_id: invite_id }
                });
                if (!inviteDetails) {
                    continue;
                }

                const userExist = await this.UserRepository.findOne({
                    where: { email: inviteDetails.email }
                });
                const registered = userExist ? true : false;
                await this.GroupInviteRepository.update(
                    {
                        invite_id: invite_id
                    },
                    {
                        registered_user: registered,
                        invite_status: Invite_Status.INVITED,
                        invited_at: new Date(),
                    },
                )
                const email = userExist?.email;
                const invited_by = adminInGroup?.user?.name;
                const group_name = adminInGroup?.group?.group_name;
                if (email)
                    setMailAndSend(
                        {
                            destinationEmail: email,
                            subject: "Invite to Join Group in Travence",
                            message:
                                `<html><p>You have been invited by ${invited_by} to join the group "${group_name}" on Travence!</p><br>
                            <p>Click the link and Login with Travence</p><br>` +
                                (registered ?
                                    `<a href="https://2j2b6xw5-3000.inc1.devtunnels.ms/signin">Login Here</a></html>`
                                    :
                                    `<a href="https://2j2b6xw5-3000.inc1.devtunnels.ms/signup">Sign Up Here</a>`
                                )
                        });

            }
            return "Invites Resent Successfully";
        }
        catch (err) {
            console.log(err);
            throw new Error("Resending Invites failled " + err);
        }
    }
    async deleteGroupInvites(input: ResendAndDeleteGroupInvitesInput) {
        try {
            const { invited_by, invites } = input;
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: invited_by,
                    user_role: GroupMember_Role.ADMIN
                }
            });
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            for (const invite_id of invites) {
                await this.GroupInviteRepository.delete(
                    { invite_id: invite_id }
                );
            }
            return "Invites deleted Successfully";
        }
        catch (err) {
            console.log(err);
            throw new Error("Invites deleted failed " + err);
        }
    }
    async acceptGroupInvite(input: GroupInviteActionsInput) {
        try {
            const { invite_id } = input;
            const inviteDetails = await this.GroupInviteRepository.findOne({
                where: { invite_id: invite_id }
            });
            if (!inviteDetails) {
                throw new Error("Invite Details not found");
            }
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: inviteDetails?.invited_by?.member_id,
                    user_role: GroupMember_Role.ADMIN
                },
                relations: ["group"]
            })
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            const user = await this.UserRepository.findOne({
                where: { email: inviteDetails?.email }
            })
            if (!user) {
                throw new Error("User not found");
            }
            const joinedMessage = await this.GroupMemberService.createGroupMember(
                {
                    group_id: adminInGroup?.group?.group_id,
                    user_role: GroupMember_Role.MEMBER
                }, user?.user_id);
            await this.GroupInviteRepository.delete({
                email: user?.email,
                invited_by: {
                    group: adminInGroup?.group
                }
            })
            return joinedMessage;
        }
        catch (err) {
            console.log(err);
            throw new Error("Accept Group Invite failed " + err);
        }
    }
    async rejectGroupInvite(input: GroupInviteActionsInput) {
        try {
            const { invite_id } = input;
            const inviteDetails = await this.GroupInviteRepository.findOne({
                where: { invite_id: invite_id }
            });
            if (!inviteDetails) {
                throw new Error("Invite Details not found");
            }
            const adminInGroup = await this.GroupMemberRepository.findOne({
                where: {
                    member_id: inviteDetails?.invited_by?.member_id,
                    user_role: GroupMember_Role.ADMIN
                }
            })
            if (!adminInGroup) {
                throw new Error("Access denied !");
            }
            await this.GroupInviteRepository.update(
                { invite_id: invite_id },
                { invite_status: Invite_Status.REJECTED });
            return "Invite Rejected Successfully";
        }
        catch (err) {
            console.log(err);
            throw new Error("Decline Group Invite failed " + err);
        }
    }
}