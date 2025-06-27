import { Body, Controller, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { RequireLogin, UserInfo } from '@app/common';
import { AnswerAddDto } from './dto/answer-add.dto';

@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('add')
  @RequireLogin()
  async add(@Body() addDto: AnswerAddDto, @UserInfo('userId') userId: number) {
    return this.answerService.add(addDto, userId);
  }

  // @Post('list')
  // @RequireLogin()
  // async list(@UserInfo('userId') userId: number) {
  //   return this.answerService.list(userId);
  // }

  // @Post('export')
  // @RequireLogin()
  // async export(@UserInfo('userId') userId: number) {
  //   return this.answerService.export(userId);
  // }
}
