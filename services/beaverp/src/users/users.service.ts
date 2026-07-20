import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto } from '../commons/dto/PaginationDto';
import { ResponseDto } from '../commons/dto/ResponseDto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, ...rest } = createUserDto;

    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...rest,
      email,
      passwordHash: hashedPassword,
    });
    const saved = await this.userRepository.save(user);
    return new UserResponseDto(saved);
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: pagination.skip,
      take: pagination.limit,
    });
    const res = users.map((u) => new UserResponseDto(u));
    return new ResponseDto<UserResponseDto>(
      res,
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.findUser(id);
    return new UserResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { password, ...rest } = updateUserDto;
    Object.assign(user, rest);

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    const saved = await this.userRepository.save(user);
    return new UserResponseDto(saved);
  }

  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.remove(user);
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.passwordHash')
      .getOne();

    if (!user) {
      throw new NotFoundException('Usuario no existente');
    }
    return user;
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Usuario no existente');
    }
    return user;
  }
}
