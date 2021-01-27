import {
  IsEmail,
  IsISO8601,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1, {
    message:
      'First name is too short. Minimum length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(30, {
    message:
      'First name is too long. Maximum length is $constraint1 characters, but actual is $value',
  })
  readonly firstName: string;

  @IsString()
  @MinLength(1, {
    message:
      'Last name is too short. Minimum length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(30, {
    message:
      'Last name is too long. Maximum length is $constraint1 characters, but actual is $value',
  })
  readonly lastName: string;

  @IsPhoneNumber()
  @MinLength(11, {
    message: 'Phone number is too short',
  })
  readonly phone: string;

  @IsEmail()
  readonly email: string;

  @IsISO8601()
  readonly dateOfBirth: Date;
}
