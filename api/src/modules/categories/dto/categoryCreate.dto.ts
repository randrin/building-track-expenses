import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { StatusEnums } from 'src/app/utils/common-enums';

export class CategoryCreateDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please enter the title' })
  @IsString()
  @MinLength(5)
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please enter the description' })
  @IsString()
  @MinLength(6)
  readonly description: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(StatusEnums)
  readonly status: StatusEnums;
}
