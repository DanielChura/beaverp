import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../user/entities/user.schema';

export class RegisterAuthDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
