import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { GenderEnums } from 'src/app/utils/common-enums';
import { SettingType } from 'src/types/setting.type';

export class UserProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly oldPassword: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(GenderEnums)
  readonly gender: GenderEnums;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly salary: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly currency: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  @IsEmail({}, { message: 'Please enter the correct email' })
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly biography: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly dateOfBorn: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  readonly infos: {
    country: string;
    zipCode: string;
    city: string;
    addressLineOne: string;
    addressLineTwo: string;
    phonePrefix: string;
    phoneNumber: string;
  };

  @ApiProperty()
  @IsOptional()
  @IsObject()
  readonly setting: SettingType;
}
