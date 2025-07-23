import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateTodoDto {
  @Length(1, 256)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Length(1, 512)
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean = false;
}
