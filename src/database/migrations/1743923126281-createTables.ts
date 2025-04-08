import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1743923126281 implements MigrationInterface {
    name = 'CreateTables1743923126281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trip_members" ("trip_member_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "trip_id" uuid, "group_member_id" uuid, CONSTRAINT "PK_e6db0a29e8fa19ef6e66e8e91d7" PRIMARY KEY ("trip_member_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."trips_trip_status_enum" AS ENUM('planned', 'canceled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "trips" ("trip_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trip_name" character varying NOT NULL, "trip_description" character varying NOT NULL, "trip_start_date" TIMESTAMP NOT NULL, "trip_days_count" integer NOT NULL, "trip_budget" integer NOT NULL, "trip_status" "public"."trips_trip_status_enum" NOT NULL DEFAULT 'planned', "trip_activities" jsonb, "trip_checklists" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "group_id" uuid, "created_by" uuid, CONSTRAINT "PK_e3e5cd900b55f400f5eb4baf237" PRIMARY KEY ("trip_id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("group_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "group_name" character varying(100) NOT NULL, "group_description" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, CONSTRAINT "PK_7cfd923277f6ef9f89b04c60436" PRIMARY KEY ("group_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_invites_invite_status_enum" AS ENUM('invited', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "group_invites" ("invite_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "invite_status" "public"."group_invites_invite_status_enum" NOT NULL DEFAULT 'invited', "registered_user" boolean NOT NULL, "invited_at" TIMESTAMP NOT NULL DEFAULT now(), "invited_by" uuid, CONSTRAINT "PK_50b2968bd76273d1a62d350ddd3" PRIMARY KEY ("invite_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_members_user_role_enum" AS ENUM('admin', 'member')`);
        await queryRunner.query(`CREATE TABLE "group_members" ("member_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_role" "public"."group_members_user_role_enum" NOT NULL DEFAULT 'member', "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, "group_id" uuid, CONSTRAINT "PK_dd36c2f163638fffa2edd4e44f2" PRIMARY KEY ("member_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "trip_members" ADD CONSTRAINT "FK_2bc25d7b7dd3984a649d49bb9a7" FOREIGN KEY ("trip_id") REFERENCES "trips"("trip_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trip_members" ADD CONSTRAINT "FK_7764fbc6b95dfc4d4fc49c75494" FOREIGN KEY ("group_member_id") REFERENCES "group_members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_022d674880260ca1584d7452534" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_123140f8070e5c436bef866a380" FOREIGN KEY ("created_by") REFERENCES "group_members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_a2fa29bfd5351b5b7ccacbc9f7c" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_invites" ADD CONSTRAINT "FK_5d6710fc34b9a18b0d25ed4b897" FOREIGN KEY ("invited_by") REFERENCES "group_members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_20a555b299f75843aa53ff8b0ee" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_20a555b299f75843aa53ff8b0ee"`);
        await queryRunner.query(`ALTER TABLE "group_invites" DROP CONSTRAINT "FK_5d6710fc34b9a18b0d25ed4b897"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_a2fa29bfd5351b5b7ccacbc9f7c"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_123140f8070e5c436bef866a380"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_022d674880260ca1584d7452534"`);
        await queryRunner.query(`ALTER TABLE "trip_members" DROP CONSTRAINT "FK_7764fbc6b95dfc4d4fc49c75494"`);
        await queryRunner.query(`ALTER TABLE "trip_members" DROP CONSTRAINT "FK_2bc25d7b7dd3984a649d49bb9a7"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "group_members"`);
        await queryRunner.query(`DROP TYPE "public"."group_members_user_role_enum"`);
        await queryRunner.query(`DROP TABLE "group_invites"`);
        await queryRunner.query(`DROP TYPE "public"."group_invites_invite_status_enum"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "trips"`);
        await queryRunner.query(`DROP TYPE "public"."trips_trip_status_enum"`);
        await queryRunner.query(`DROP TABLE "trip_members"`);
    }

}
