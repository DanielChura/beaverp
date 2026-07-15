import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.schema';
import { PaginationDto } from '../commons/dto/PaginationDto';
import { ResponseDto } from '../commons/dto/ResponseDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, ...rest } = createUserDto;

    const exists = await this.userModel.exists({ email }).exec();
    if (exists) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    return new UserResponseDto(user);
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const users = await this.userModel
      .find()
      .select('-password')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean()
      .exec();
    const res = users.map((u) => new UserResponseDto(u));
    const total = await this.userModel.countDocuments().exec();
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
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return new UserResponseDto(user);
  }

  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Usuario no existente');
    }
    return user;
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('Usuario no existente');
    }
    return user;
  }
}
