import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
    this.isActive = user.isActive;
    this.tenantId = user.tenantId;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
