import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { ConfigNotInitializedException } from './common/exceptions/config-not-initialized.exception';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription(
      'API documentation for Todo application - manage tasks and track their completion',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);

  const appConfig: AppConfig | undefined = configService.get<AppConfig>('app');

  if (!appConfig) {
    throw new ConfigNotInitializedException('appConfig');
  }

  const port: number = appConfig.port;
  const host: string = appConfig.host;

  await app.listen(port, host);
}

void bootstrap();
