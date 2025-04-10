import { mockFindOne, mockUsers } from "../__mocks__/Users";
import { decryptPassword } from "../helper/Crypto/crypto";
import { UserService } from "../modules/User/user.service";
import jwt from "jsonwebtoken";
jest.mock('../helper/Crypto/crypto');
jest.mock("jsonwebtoken");
import usermockRepository from '../__mocks__/Users';

jest.mock("../database/data-source", () => {
    return {
        __esModule: true,
        default: {
            getRepository: jest.fn(() => usermockRepository),
        }
    }
});
describe("UserService - loginUser", () => {
    let userService: UserService;

    beforeEach(() => {
        jest.clearAllMocks();
        userService = new UserService();
        
        mockFindOne.mockImplementation(({ where: { email } }) => {
            const storedUser = mockUsers.find(user => user.email === email);
            return Promise.resolve(storedUser || null); 
        });
        (decryptPassword as jest.Mock).mockImplementation((password)=>{
            return Promise.resolve(password);
        });
        
        (jwt.sign as jest.Mock).mockReturnValue("Jwt token signed");
    });


    test("User not found", async () => {
        
        const result = await userService.signin({ email: "demo2@gmail.com", password: "WrongPassword" });
        expect(result).toBe("Signin failed: User not found");
        
    });

    test("Password wrong", async () => {
      
        const result =    await userService.signin({ email: "demo1@gmail.com", password: "WrongPassword" });
        expect(result).toBe("Signin failed: Password Wrong");
        
    });

    test("Successful login", async () => {
        const result = await userService.signin({ email: "demo1@gmail.com", password: "Demo123@" });
        expect(result).toBe("Jwt token signed");
    });
});