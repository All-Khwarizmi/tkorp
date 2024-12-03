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
      .setDescription(
        `
API pour la gestion des animaux et leurs propriétaires.

## Fonctionnalités

### Gestion des Animaux
- CRUD complet pour les animaux
- Recherche par ID, espèce, race, etc.
- Statistiques (plus vieux, plus lourd, etc.)
- Relations avec les propriétaires

### Gestion des Propriétaires
- CRUD complet pour les propriétaires
- Liste des animaux par propriétaire
- Statistiques des propriétaires

### Statistiques
- Espèces les plus communes
- Propriétaire avec le plus d'animaux
- Propriétaire avec les animaux les plus lourds
- Records (âge, poids, etc.)
      `,
      )
      .setVersion('1.0')
      .addTag('Application', "Endpoints généraux de l'application")
      .addTag('Animals', 'Gestion des animaux')
      .addTag('Persons', 'Gestion des propriétaires')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customSiteTitle: 'Pet Management API Documentation',
      customfavIcon: 'https://nestjs.com/img/logo_text.svg',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui-themes/3.0.0/themes/3.x/theme-material.css',
      ],
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    });

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
