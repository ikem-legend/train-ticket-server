import {
  IsEmail,
  IsISO8601,
  IsPhoneNumber,
  IsString,
  Matches,
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

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {
    message:
      'Password must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters',
  })
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsISO8601()
  readonly dateOfBirth: Date;
}
