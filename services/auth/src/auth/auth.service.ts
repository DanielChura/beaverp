import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: LoginAuthDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(req.email);
    if (!(await bcrypt.compare(req.password, user.password))) {
      throw new UnauthorizedException('Usuario no autorizado');
    }
    const payload = { sub: user.email, role: user.role };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(req: RegisterAuthDto): Promise<LoginResponseDto> {
    const user = await this.userService.create(req);
    const payload = { sub: user.email, role: user.role };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
