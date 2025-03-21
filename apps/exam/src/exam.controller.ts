import { Controller, Get, Inject } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';

@Controller()
export class ExamController {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  constructor(private readonly examService: ExamService) {}

  @Get()
  getHello(): string {
    const keys = this.redisService.keys('*');
    return this.examService.getHello() + keys;
  }

  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    return numArr.reduce((total, item) => total + item, 0);
  }
}
