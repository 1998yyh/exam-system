import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';

@Injectable()
export class AnalyseService {
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async ranking(examId: number) {
    const answers = await this.prismaService.answer.findMany({
      where: {
        examId,
      },
    });

    for (let i = 0; i < answers.length; i++) {
      await this.redisService.zAdd('ranking' + examId, {
        [answers[i].id]: answers[i].score,
      });
    }

    return this.redisService.zRankingList('ranking:' + examId, 0, 10);
  }
}
