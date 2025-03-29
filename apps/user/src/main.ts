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

  app.useGlobalPipes(
    new ValidationPipe({
      // 自动转化成DTO类型 比如username是string类型 但是请求体中是number类型 会自动转化成string类型
      transform: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();
