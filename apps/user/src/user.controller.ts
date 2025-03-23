import { RedisService } from './../../../libs/redis/src/redis.service';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/regiser-user.dto';
import { EmailService } from '@app/email';

@Controller('user')
export class UserController {
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  constructor(private readonly userService: UserService) {}

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.keys('*');
    return this.userService.getHello() + keys;
  }

  @Get('register-captcha')
  async sendCode(@Query('address') address: string) {
    const code = Math.random().toString().slice(2,8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`
    });
    return '发送成功';
  }

  @Post('register')
  async register(@Body() regiserUser: RegisterUserDto) {
    return this.userService.register(regiserUser);
  }
}
