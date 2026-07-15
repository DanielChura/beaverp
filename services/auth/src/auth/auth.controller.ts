import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() req: LoginAuthDto): Promise<LoginResponseDto> {
    return this.authService.login(req);
  }

  @Post('register')
  register(@Body() req: RegisterAuthDto): Promise<LoginResponseDto> {
    return this.authService.register(req);
  }
}
