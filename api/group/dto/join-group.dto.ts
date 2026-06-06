import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class JoinGroupDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
