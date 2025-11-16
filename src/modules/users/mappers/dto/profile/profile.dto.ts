import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Date and time when the user last changed their password',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Expose()
  passwordChangedAt: Date;

  @ApiProperty({
    description: 'Date and time when the user was created',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the user was last updated',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
