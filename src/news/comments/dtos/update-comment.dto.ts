import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  // @IsOptional()
  @ValidateIf((o) => o.message)
  message: string;
}
