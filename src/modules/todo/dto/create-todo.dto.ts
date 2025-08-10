import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateTodoDto {
  @Length(1, 255)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Length(1, 512)
  @IsString()
  @IsOptional()
  description: string | null = null;

  @IsBoolean()
  @IsOptional()
  completed: boolean = false;
}
