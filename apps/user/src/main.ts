import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.connectMicroservice({
    transport: 0,
    options: {
      port: 8888,
    },
  });

  app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
