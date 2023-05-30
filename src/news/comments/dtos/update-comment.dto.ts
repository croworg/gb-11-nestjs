import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatar: string;
}
