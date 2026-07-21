import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from 'src/users/users.service';
import { TenantsService } from 'src/tenants/tenants.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: LoginAuthDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(req.email);
    if (!(await bcrypt.compare(req.password, user.passwordHash))) {
      throw new UnauthorizedException('Usuario no autorizado');
    }
    const payload = {
      sub: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(req: RegisterAuthDto): Promise<LoginResponseDto> {
    const tenant = await this.tenantsService.create({
      companyName: req.companyName,
      taxId: req.taxId,
    });

    const userDto = new CreateUserDto();
    userDto.email = req.email;
    userDto.password = req.password;
    userDto.role = 'admin' as any;
    userDto.tenantId = tenant.id;

    const user = await this.usersService.create(userDto);

    const payload = {
      sub: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
