import { ApiProperty } from '@nestjs/swagger';

export class BasePaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items in the current page' })
  data: T[];

  @ApiProperty({ description: 'Total number of items across all pages' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;
}
