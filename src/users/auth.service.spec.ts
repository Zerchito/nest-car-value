import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {

  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User
        users.push(user);
        return Promise.resolve(user);
      }
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  })

  it('can create an instance of Auth service', async () => {
    expect(service).toBeDefined();
  })

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test1.com', "password");
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Thorws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    expect(service.signup('test2@test.com', 'password'))
      .rejects.toThrow(
        BadRequestException,
      );
  });

  it('Thorws if signin is called with an unused email', async () => {
    await expect(
      service.signin('test3@test.com', 'password'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'test4@test.com', password: 'password' } as User,
      ]);
    await expect(
      service.signin('test4@test.com', 'password2'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Returns a user if correct password is provided', async () => {
    await service.signup('test7@test.com', 'mypassword');
    const user = await service.signin('test7@test.com', 'mypassword');
    expect(user).toBeDefined();
  });
})
