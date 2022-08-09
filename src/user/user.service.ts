import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringify } from 'querystring';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  createUser(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }
  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Id not found');
    }
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);

    return this.repo.save(user);
  }
  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
