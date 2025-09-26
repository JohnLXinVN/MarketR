import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { BusinessExceptionFilter } from './common/filters/business-exception.filter';
import { CustomLogger } from './common/filters/custom-logger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    session({
      secret: 'super-secret', // đổi thành chuỗi mạnh hơn
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }, // session sống 1 phút
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN, // Cho phép Next.js gọi
    credentials: true, // Cho phép gửi cookie (nếu bạn dùng session)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
