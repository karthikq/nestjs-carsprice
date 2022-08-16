/** @format */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';

import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { CreateUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userDto } from './dto/User.dto';

import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('auth')
@Serialize(userDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signout')
  signOut(@Session() session: any) {
    console.log(session.userId);

    session.userId = null;
  }
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Get('/user')
  @UseGuards(AuthGuard)
  getUser(@CreateUser() user: User) {
    console.log(user);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  findAllUser(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(parseInt(id), body);
  }
}
