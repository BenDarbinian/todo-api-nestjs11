import { Allow, IsOptional, IsPositive, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BaseGetDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    maximum: 999999999,
  })
  @Max(999999999)
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  readonly page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    maximum: 100,
  })
  @Max(100)
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  readonly limit: number = 10;

  get skip() {
    return (this.page - 1) * this.limit;
  }
}
