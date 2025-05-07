import { Inject, Injectable } from '@nestjs/common';
import { ExamAddDto } from './dto/exam-add.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class ExamService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;
  getHello(): string {
    return 'Hello World!';
  }

  async add(dto: ExamAddDto, userId: number) {
    return await this.prismaService.exam.create({
      data: {
        name: dto.name,
        content: '',
        createUser: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
