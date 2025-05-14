import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/regiser-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  @Inject(RedisService)
  private redis: RedisService;

  @Inject(PrismaService)
  private prisma: PrismaService;

  private logger = new Logger();

  async register(user: RegisterUserDto) {
    const captcha = await this.redis.get(`captcha_${user.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.prisma.user.create({
        data: {
          username: user.username,
          password: user.password,
          email: user.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
        },
      });
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async login(loginUser: LoginUserDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: loginUser.username,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.password !== loginUser.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    delete foundUser.password;
    return foundUser;
  }

  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redis.get(
      `update_password_captcha_${passwordDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: passwordDto.username,
      },
    });

    try {
      await this.prisma.user.update({
        where: {
          id: foundUser.id,
        },
        data: foundUser,
      });

      return '密码修改成功';
    } catch (e) {
      this.logger.error(e);
      return '密码修改失败';
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getUserList() {
    const list = await this.prisma.user.findMany({
      select: {
        username: true,
      },
    });

    return list.map((item) => item.username);
  }
}
