import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('authService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  let users: User[] = [];

  beforeEach(async () => {
    fakeUserService = {
      find: (email) => {
        const filteredUser = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUser);
      },
      createUser: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of authservice', async () => {
    expect(service).toBeDefined();
  });
  it('should generate a hashed password', async () => {
    const user = await service.signup('a@a.com', 'pass');

    expect(user.password).not.toEqual('pass');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if the user has already signed up', async () => {
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: 'a@a.com', password: 's' } as User]);

    try {
      await service.signup('a@a.com', 'pass');
    } catch (error) {
      expect(error.message).toBe('email is already in use');
    }
  });

  it("throws an error if email doesn't exists", async () => {
    try {
      await service.signIn('a@aa.com', 'sss');
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });
  it('comparing users password', async () => {
    await service.signup('a@aa.com', 'passs');
    try {
      await service.signIn('a@aa.com', 'asd');
    } catch (error) {
      expect(error.message).toBe('wrong password');
    }
  });
  it('returns a correct password', async () => {
    await service.signup('a@a2.com', 'passs');

    const user = await service.signIn('a@a2.com', 'passs');
    expect(user).toBeDefined();
  });
});
