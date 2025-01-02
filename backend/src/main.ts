import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { COMMON_CONFIG_KEYS } from './common/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation setup
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  // Security setup
  app.enableCors();
  app.use(helmet());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Memecoin Maverick API')
    .setDescription('The Memecoin Maverick API description')
    .setVersion('1.0')
    .addTag('memecoin-maverick')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Fetch port from config
  const configService = app.get(ConfigService);
  const port = configService.get(COMMON_CONFIG_KEYS.PORT);

  // Start server
  await app.listen(port || 3000);
}
bootstrap();
