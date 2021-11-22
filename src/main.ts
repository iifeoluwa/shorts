import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });

  const docsConfig = new DocumentBuilder()
    .setTitle('URL shortener')
    .setDescription('The ultimate url shortening experience')
    .setVersion('1.0')
    .addTag('links')
    .build();
  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('app.port');
  await app.listen(port);
  logger.log(`Application is started on port: ${port}`);
}
bootstrap();
