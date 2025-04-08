import dataSource from "../../database/data-source";
import { User } from "./entity/User.entity";
import { SigninInput, SignupInput, UpdateUserInput } from "./user.input";
import jwt from "jsonwebtoken";
import { decryptPassword, encryptPassword } from "../../helper/Crypto/crypto";
import dotenv from 'dotenv';
import { LoginResponse } from "./user.response";
import { GroupInvite } from "../GroupInvite/entity/GroupInvites.entity";
import { Repository } from "typeorm";
import { MyContext } from "../../server";
dotenv.config();
console.log()

export class UserService {
   
        private UserRepository:Repository<User>;
        private GroupInviteRepository:Repository<GroupInvite>;
        constructor(){
            this.UserRepository = dataSource.getRepository(User);
            this.GroupInviteRepository = dataSource.getRepository(GroupInvite);
        }
   

    async getCurrentUser(ctx: MyContext) {
        try {
            if(!ctx?.user?.user_id){
                throw new Error("No Input found");
            }
            const user = await this.UserRepository.findOne({
                where: {
                    user_id: ctx?.user?.user_id
                }
            });
            if(!user){
                throw new Error("User not found");
            }
            return user;
        }
        catch (err) {
            throw new Error("fecthing user details failed" + err);
        }
    }
    async signin(input: SigninInput) {
        try {
            const { email, password } = input;
            const user = await this.UserRepository.findOneBy({
                email: email,
            });
            if (!user) {
                throw new Error("User not found");
            }
            const decryptedPassword = decryptPassword(user?.password);

            if (password !== decryptedPassword) {
                throw new Error("Password Wrong");
            }
            const { user_id } = user;
            if (!process.env.JWT_SECRET_KEY) {
                throw new Error("Secret Key not found");
            }
            const token = jwt.sign({ user_id: user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            return {
                token: token
            };
        }
        catch (err) {
            throw new Error("Signin failed" + err);
        }

    }
    async signup(input: SignupInput){
        const { name, email, password } = input;
        try {
            const UserExists = await this.UserRepository.findOne({
                where: { email: email },
                withDeleted: true
            });
            const encryptedPassword = encryptPassword(password);
            if (UserExists) {
                if (UserExists?.deleted_at === null) {
                    throw new Error("User already Exists");
                } else {
                    await this.UserRepository.restore(UserExists.user_id);
                    if (encryptedPassword)
                        UserExists.password = encryptedPassword;
                    UserExists.name = name;
                    await this.UserRepository.save(UserExists);
                }
            } else {
                const userCreated = await this.UserRepository.create({
                    name: name,
                    email: email,
                    password: encryptedPassword
                });
                await this.UserRepository.save(userCreated);
            }
            const invitesCount = await this.GroupInviteRepository.count({
                where: { email: email }
            });
            if (invitesCount) {
                await this.GroupInviteRepository.update(
                    { email: email },
                    { registered_user: true }
                );
            }
            return "User Registered";
        }
        catch (err) {
            throw new Error("Registeration failed " + err);
        }
    }
    async updateUser(input: UpdateUserInput) {
        try {
            const { user_id, name, password } = input;
            const user = await this.UserRepository.findOne({
                where: { user_id: user_id }
            });
            if (!user) {
                throw new Error("User not found");
            }

            user.name = name;
            user.password = password;
            await this.UserRepository.save(user);
            return "User details Updated Successfully";
        }
        catch (err) {
            console.log(err);
            throw new Error("Updation failed " + err);
        }
    }
}