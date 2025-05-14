import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ExamService } from './exam.service';
import { RedisService } from '@app/redis';
import { RequireLogin, UserInfo } from '@app/common';
import { ExamAddDto } from './dto/exam-add.dto';

@Controller('exam')
export class ExamController {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  constructor(private readonly examService: ExamService) {}

  @Get()
  getHello(): string {
    const keys = this.redisService.keys('*');
    return this.examService.getHello() + keys;
  }

  @Post('add')
  @RequireLogin()
  async add(@Body() dto: ExamAddDto, @UserInfo('userId') userId: number) {
    return this.examService.add(dto, userId);
  }

  @Post('list')
  @RequireLogin()
  async list(@UserInfo('userId') userId: number) {
    return this.examService.list(userId);
  }

  @Post('delete')
  @RequireLogin()
  async delete(@UserInfo('userId') userId: number, @Body('id') id: number) {
    return this.examService.delete(userId, id);
  }
}
