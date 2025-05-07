import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { RedisModule } from '@app/redis';
import { AuthGuard } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@app/prisma';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [RedisModule, PrismaModule, JwtModule],
  controllers: [ExamController],
  providers: [
    ExamService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ExamModule {}
