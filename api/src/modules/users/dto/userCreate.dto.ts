import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  Matches,
  IsObject,
} from 'class-validator';
import { GenderEnums } from 'src/app/utils/common-enums';

export class UserCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(GenderEnums)
  readonly gender: GenderEnums;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  @IsEmail({}, { message: 'Please enter the correct email' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly role: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  readonly contact: {
    phonePrefix: string;
    phoneNumber: string;
  };

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly dateOfBorn: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly project: string;
}
