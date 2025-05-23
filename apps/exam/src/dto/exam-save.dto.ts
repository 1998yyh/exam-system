import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExamSaveDto {
  @IsNotEmpty({ message: '考试id不能为空' })
  @Type(() => Number)
  id: number;

  @IsString()
  content: string;
}
