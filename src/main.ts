import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

process.on('unhandledRejection', (reason, promise) => {
  console.info('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.info('Uncaught Exception thrown:', error);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('blockchain-service API Doc')
    .setDescription('Hedera blockchain service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerUiEnabled: process.env.NODE_ENV !== 'production',
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.BLOCKCHAIN_PORT ?? 3000;
  await app.listen(port);
  console.info(`Blockchain service is running at http://localhost:${port}`);
  console.info(`Swagger docs → http://localhost:${port}/api-docs`);
}

bootstrap().catch((error) => {
  console.info('App failed to start:', error);
  process.exit(1);
});
