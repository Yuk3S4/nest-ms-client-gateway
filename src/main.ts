import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger('Main Gateway')
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
  );

  // Manejo custom de Excepciones
  app.useGlobalFilters(new RpcCustomExceptionFilter())

  await app.listen(envs.port);

  console.log('Hola Mundo - segundo cambio');
  

  logger.log(`Gateway running on port ${ envs.port }`)
}
bootstrap();
