import dataSource from "../../database/data-source";
import { User } from "./entity/User.entity";
import { SigninInput, SignupInput } from "./user.input";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { decryptPassword, encryptPassword } from "../../helper/Crypto/crypto";
import dotenv from 'dotenv';
import { LoginResponse } from "./user.response";
import { Arg } from "type-graphql";
dotenv.config();
console.log()

export class UserService {
    private UserRepository = dataSource.getRepository(User);
 
    async getCurrentUser(token: string): Promise<User> {
        try {
            if(!process.env.JWT_SECRET_KEY){
                throw new Error("Key not found");
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { user_id: string };

            const user = await this.UserRepository.findOneBy({ user_id: decoded.user_id });
    
            if (!user) {
              throw new Error("User not found");
            }
        
            return user;
        }
        catch(err){
            throw new Error("Get User details failed " + err);
        }
    }
    async signin(input: SigninInput): Promise<LoginResponse> {
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
    async signup(input: SignupInput): Promise<string> {
        const { name, email, password } = input;
        try {
            const UserExists = await this.UserRepository.findOneBy({
                email: email
            });
            if (UserExists) {
                throw new Error("User Already Exists");
            }
            const encryptedPassword = encryptPassword(password);
            console.log(encryptedPassword)
            await this.UserRepository.save({
                user_id: uuidv4(),
                name: name,
                email: email,
                password: encryptedPassword
            });
            return "User Registered";
        }
        catch (err) {
            throw new Error("Registeration failed " + err);
        }
    }
}