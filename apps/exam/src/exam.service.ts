import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ExamAddDto } from './dto/exam-add.dto';
import { PrismaService } from '@app/prisma';
import { ExamSaveDto } from './dto/exam-save.dto';

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
  async list(userId: number, bin: string) {
    return this.prismaService.exam.findMany({
      where:
        bin !== undefined
          ? {
              createUserId: userId,
              isDelete: true,
            }
          : {
              createUserId: userId,
            },
    });
  }

  // 删除考试
  async delete(userId: number, id: number) {
    if (!id) {
      throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
    }
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

  // 保存考试
  async save(dto: ExamSaveDto) {
    return await this.prismaService.exam.update({
      where: { id: dto.id },
      data: {
        content: dto.content,
      },
    });
  }

  // 发布考试
  async publish(userId: number, id: number) {
    if (!id) {
      throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
    }

    return await this.prismaService.exam.update({
      where: { id, createUserId: userId },
      data: { isPublish: true },
    });
  }
}
