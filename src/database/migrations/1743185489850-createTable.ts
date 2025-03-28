import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1743185489850 implements MigrationInterface {
    name = 'CreateTable1743185489850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("group_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "group_name" character varying(100) NOT NULL, "group_description" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "createdByUserId" uuid, CONSTRAINT "PK_7cfd923277f6ef9f89b04c60436" PRIMARY KEY ("group_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_members_user_role_enum" AS ENUM('admin', 'member')`);
        await queryRunner.query(`CREATE TABLE "group_members" ("member_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_role" "public"."group_members_user_role_enum" NOT NULL DEFAULT 'member', "joinet_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userIdUserId" uuid, "groupIdGroupId" uuid, CONSTRAINT "PK_dd36c2f163638fffa2edd4e44f2" PRIMARY KEY ("member_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_invites_invite_status_enum" AS ENUM('invited', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "group_invites" ("invite_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "invite_status" "public"."group_invites_invite_status_enum" NOT NULL DEFAULT 'invited', "registered_user" boolean NOT NULL, "invited_at" TIMESTAMP NOT NULL DEFAULT now(), "invitedByMemberId" uuid, CONSTRAINT "PK_50b2968bd76273d1a62d350ddd3" PRIMARY KEY ("invite_id"))`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_6c0972dec3d64cece372b74b742" FOREIGN KEY ("createdByUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_cd41d1e6e95b985b8f69ea0f2f7" FOREIGN KEY ("userIdUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_37b255e757164cd62266a0e677d" FOREIGN KEY ("groupIdGroupId") REFERENCES "groups"("group_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_invites" ADD CONSTRAINT "FK_90c77c007f6f1937033856c3168" FOREIGN KEY ("invitedByMemberId") REFERENCES "group_members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_invites" DROP CONSTRAINT "FK_90c77c007f6f1937033856c3168"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_37b255e757164cd62266a0e677d"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_cd41d1e6e95b985b8f69ea0f2f7"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_6c0972dec3d64cece372b74b742"`);
        await queryRunner.query(`DROP TABLE "group_invites"`);
        await queryRunner.query(`DROP TYPE "public"."group_invites_invite_status_enum"`);
        await queryRunner.query(`DROP TABLE "group_members"`);
        await queryRunner.query(`DROP TYPE "public"."group_members_user_role_enum"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
