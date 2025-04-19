import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on http://localhost:${port}`);
}

bootstrap().catch(err => {
  logger.error('❌ Error during app bootstrap', err);
  process.exit(1);
});
