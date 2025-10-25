import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'ISO formatted date when the access token expires',
    example: '2025-12-31T23:59:59.999Z',
  })
  expiresAt: string;

  @ApiProperty({
    description: 'ISO formatted date after which token should be refreshed',
    example: '2025-12-31T22:59:59.999Z',
  })
  refreshAfter: string;
}
