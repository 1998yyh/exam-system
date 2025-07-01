import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_SERVICE')
  private redisClient: RedisClientType;

  async keys(pattern: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async get(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    if (expireSeconds) {
      await this.redisClient.setEx(key, expireSeconds, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async zRankingList(key: string, start: number = 0, end: number = -1) {
    return this.redisClient.zRange(key, start, end, {
      REV: true,
    });
  }

  async zAdd(key: string, members: Record<string, number>) {
    const mems = [];
    for (const key in members) {
      mems.push({
        value: key,
        score: members[key],
      });
    }
    return await this.redisClient.zAdd(key, mems);
  }
}
