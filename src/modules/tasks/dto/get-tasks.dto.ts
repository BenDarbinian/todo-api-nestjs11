import { BaseGetDto } from '../../../common/dto/base-get.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsDateOnly } from '../../../common/validators/is-date-only.validator';

export class GetTasksDto extends BaseGetDto {
  @ApiProperty({
    description: 'Filter tasks by date in YYYY-MM-DD format',
    required: false,
    example: '2025-08-31',
  })
  @IsDateOnly()
  @IsOptional()
  readonly date?: string;
}
