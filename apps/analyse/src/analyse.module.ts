import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';
import { RedisModule } from '@app/redis';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [AnalyseController],
  providers: [AnalyseService],
})
export class AnalyseModule {}
