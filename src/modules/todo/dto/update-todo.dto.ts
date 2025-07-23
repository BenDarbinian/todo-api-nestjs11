import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateTodoDto {
  @Length(1, 256)
  @IsString()
  @IsOptional()
  title?: string;

  @Length(1, 512)
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
