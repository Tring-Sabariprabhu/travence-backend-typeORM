export const mockFindOne = jest.fn();
export const mockSave = jest.fn();

  
export const mockUsers = [
    {
        user_id: "1",
        name: "Demo1",
        email: "demo1@gmail.com",
        password: "Demo123@"
    }
]

const loginRepository: any  = {
    findOne: mockFindOne,
    
}

export default loginRepository;