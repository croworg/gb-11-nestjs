import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  author!: string;

  @IsOptional()
  @IsNumber()
  countView: number;

  @IsOptional()
  @IsString()
  cover: string;
}
