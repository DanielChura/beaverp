import { IsString, IsNotEmpty } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
