import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Role } from '../src/user/entities/user.schema';
import { UserService } from '../src/user/user.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  await userService.create({
    name: 'admin',
    email: 'admin@beaverp.com',
    password: 'admin123',
    role: Role.ADMIN,
  });
  console.log('Admin creado');
  await app.close();
}

seed();
