import { firstValueFrom } from 'rxjs';
import { Controller, Get, Inject } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examService: ClientProxy;

  @Get()
  async getHello() {
    const value = await firstValueFrom(this.examService.send('sum', [1, 3, 5]));
    return this.answerService.getHello() + ' ' + value;
  }
}
