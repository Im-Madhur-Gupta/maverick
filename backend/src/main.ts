import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // General setup
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
