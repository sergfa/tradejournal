import { IsEmail, MaxLength, MinLength } from 'class-validator';
export class UserDTO {
  @MinLength(8)
  @MaxLength(20)
  username: string;

  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsEmail()
  email: string;
}
