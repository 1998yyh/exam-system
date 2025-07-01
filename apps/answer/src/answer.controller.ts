import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { RequireLogin, UserInfo } from '@app/common';
import { AnswerAddDto } from './dto/answer-add.dto';
import { ExcelService } from '@app/excel';

@Controller('answer')
export class AnswerController {
  @Inject(ExcelService)
  private excelService: ExcelService;

  constructor(private readonly answerService: AnswerService) {}

  @Post('add')
  @RequireLogin()
  async add(@Body() addDto: AnswerAddDto, @UserInfo('userId') userId: number) {
    return this.answerService.add(addDto, userId);
  }

  @Post('list')
  @RequireLogin()
  async list(@Body('examId') examId: string) {
    if (!examId) {
      throw new BadRequestException('examId 不能为空');
    }
    return this.answerService.list(+examId);
  }

  @Post('find/:id')
  @RequireLogin()
  async find(@Param('id') id: string) {
    return this.answerService.find(+id);
  }

  @Post('export')
  async export(@Body('examId') examId: string) {
    if (!examId) {
      throw new BadRequestException('examId 不能为空');
    }

    return this.excelService.export();
  }
}
