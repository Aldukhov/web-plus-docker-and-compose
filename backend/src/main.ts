import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(
    session({
      secret: 'webdev2024', // Замените на ваш секретный ключ
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 час
    }),
  );
  await app.listen(3000);
}
bootstrap();
