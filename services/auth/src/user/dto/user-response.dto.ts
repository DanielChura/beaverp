import { Role, User } from '../entities/user.schema';
import { ObjectId } from 'mongoose';

export class UserResponseDto {
  id: ObjectId;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  role: Role;

  constructor(user: User) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.address = user.address;
    this.phone = user.phone;
    this.role = user.role;
  }
}
