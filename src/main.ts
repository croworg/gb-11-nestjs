import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as expressHbs from 'express-handlebars';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.engine(
    'hbs',
    expressHbs({
      extname: 'hbs',
      defaultLayout: 'layout',
      layoutDir: join(__dirname, '..', 'views/layouts'),
      partialsDir: join(__dirname, '..', 'views/partials'),
    }),
  );

  await app.listen(3000);
}
bootstrap();
