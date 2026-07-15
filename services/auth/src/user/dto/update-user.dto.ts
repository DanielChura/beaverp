import { Prop } from '@nestjs/mongoose';
import { Role } from '../../user/entities/user.schema';

export class UpdateUserDto {
  @Prop({ maxLength: 50, required: false })
  name?: string;

  @Prop({ maxLength: 50, required: false, unique: true })
  email?: string;

  @Prop({ maxLength: 50, required: false })
  address?: string;

  @Prop({ maxLength: 50, required: false })
  phone?: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ enum: Role, required: false })
  role?: Role;
}
