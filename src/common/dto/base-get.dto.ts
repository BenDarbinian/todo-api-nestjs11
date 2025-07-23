import { IsOptional, IsPositive, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseGetDto {
  @Max(999999999)
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @Max(100)
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  get skip() {
    return (this.page - 1) * this.limit;
  }
}
