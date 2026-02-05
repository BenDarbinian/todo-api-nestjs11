import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ProfileResource {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Date and time when the user last changed their password',
    example: '2025-01-01T00:00:00.000Z',
  })
  passwordChangedAt: Date;

  @ApiProperty({
    description: 'Date and time when the user verified their email',
    example: '2025-01-02T00:00:00.000Z',
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  @ApiProperty({
    description: 'Date and time when the user was created',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the user was last updated',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.passwordChangedAt = user.passwordChangedAt;
    this.emailVerifiedAt = user.emailVerifiedAt ?? null;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
