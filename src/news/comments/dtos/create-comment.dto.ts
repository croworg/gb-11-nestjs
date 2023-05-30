import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  // @IsNotEmpty()
  // @IsNumber()
  // id: number;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatar: string;
}
