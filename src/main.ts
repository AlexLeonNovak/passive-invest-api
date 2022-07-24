import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const {
  PORT = 5000,
  NODE_ENV = 'development',
  COOKIE_SECRET = 'cookie_secret',
} = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: NODE_ENV === 'production' ? '*' : true,
    },
  });

  app.setGlobalPrefix('api/v1');
  app.use(cookieParser(COOKIE_SECRET));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Passive invest helper API')
    .setDescription('RestAPI doc')
    .setVersion('1.0.0')
    .setContact('Alex Novak', '', 'alexleonnovak@gmail.com')
    .addTag('Alex Dev')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDoc);

  await app.listen(PORT, () => console.log(`Server starts on port ${PORT}`));
}

bootstrap();
