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

  // 添加考试
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

  // 获取考试列表
  async list(userId: number) {
    return this.prismaService.exam.findMany({
      where: {
        createUserId: userId,
        isDelete: false,
      },
    });
  }

  // 删除考试
  async delete(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isDelete: true,
      },
    });
  }
}
