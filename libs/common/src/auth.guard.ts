import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      // 允许获取方法级别的装饰器参数
      context.getHandler(),
      // 允许获取类级别的装饰器参数
      context.getClass(),
    ]);

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);

      request.user = {
        userId: data.userId,
        username: data.username,
      };

      response.header(
        'token',
        this.jwtService.sign(
          {
            userId: data.userId,
            username: data.username,
          },
          {
            expiresIn: '7d',
          },
        ),
      );
      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效, 请重新登录');
    }
  }
}
