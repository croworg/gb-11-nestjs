import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsNumber()
  countView: number;

  @IsOptional()
  @IsString()
  cover: string;
}
