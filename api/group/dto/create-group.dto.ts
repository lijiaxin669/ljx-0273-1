import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min, IsDateString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsInt()
  @Min(1)
  targetCount: number;

  @IsInt()
  @Min(1)
  stock: number;

  @IsDateString()
  deadline: string;
}
