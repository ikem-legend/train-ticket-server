import { IsEmail, IsString, IsUUID, Matches } from 'class-validator';

export class ResetUserPasswordDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {
    message:
      'Password must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters',
  })
  readonly password: string;

  @IsUUID('4')
  readonly confirmationToken: string;
}
