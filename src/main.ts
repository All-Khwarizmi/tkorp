import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { initializeDb } from './scripts/db-setup';

async function bootstrap() {
  try {
    // Initialisation de la base de données
    await initializeDb();
    console.log('Database initialized successfully');

    const app = await NestFactory.create(AppModule);

    // Configuration Swagger
    const config = new DocumentBuilder()
      .setTitle('Pets API')
      .setDescription('API pour la gestion des animaux et leurs propriétaires')
      .setVersion('1.0')
      .addTag('pets')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.enableCors();

    const port = process.env.PORT || 5001;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on port ${port}`);
    console.log(`Swagger documentation available at /api`);
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

bootstrap();
