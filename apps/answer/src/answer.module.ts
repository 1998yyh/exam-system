import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { PrismaModule } from '@app/prisma';
import { AuthGuard, CommonModule } from '@app/common';
import { ExcelModule } from '@app/excel';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXAM_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
    PrismaModule,
    CommonModule,
    ExcelModule,
  ],
  controllers: [AnswerController],
  providers: [
    AnswerService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AnswerModule {}
