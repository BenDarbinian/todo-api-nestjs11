import { IsBoolean, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sometimes } from '../../../common/validators/sometimes.validator';

export class UpdateSubtaskDto {
  @ApiProperty({
    description: 'The title of the subtask',
    minLength: 1,
    maxLength: 255,
    required: false,
    example: 'Buy apples',
  })
  @Length(1, 255)
  @IsString()
  @Sometimes()
  readonly title?: string;

  @ApiProperty({
    description: 'Indicates if the subtask is completed',
    required: false,
    example: true,
  })
  @IsBoolean()
  @Sometimes()
  readonly completed?: boolean;
}
