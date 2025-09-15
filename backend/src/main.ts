import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';

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
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
