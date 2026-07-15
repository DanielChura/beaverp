import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export enum Role {
  ADMIN = 'ADMIN',
  SELL = 'SELL',
  STORE = 'STORE',
}

@Schema()
export class User {
  _id: ObjectId;

  @Prop({ maxLength: 50, required: true })
  name: string;

  @Prop({ maxLength: 50, required: true, unique: true })
  email: string;

  @Prop({ maxLength: 50, required: false })
  address?: string;

  @Prop({ maxLength: 50, required: false })
  phone?: string;

  @Prop({ required: true, minLength: 6 })
  password: string;

  @Prop({ enum: Role, required: true })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
