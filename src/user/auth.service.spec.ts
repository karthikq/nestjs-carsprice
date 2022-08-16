import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('authService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;
  beforeEach(async () => {
    fakeUserService = {
      find: () => Promise.resolve([]),
      createUser: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
});
