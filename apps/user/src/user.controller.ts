import { RedisService } from './../../../libs/redis/src/redis.service';
import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  @Inject(RedisService)
  private redisService: RedisService;

  constructor(private readonly userService: UserService) {}

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.keys('*');
    console.log('keys', keys);
    return this.userService.getHello() + keys;
  }
}
