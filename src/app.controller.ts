// apps/api/src/app.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './config/database.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('init-db')
  async initDb() {
    try {
      // 1. Supprimer les tables
      await this.dbService.query('DROP TABLE IF EXISTS animal;');
      await this.dbService.query('DROP TABLE IF EXISTS person;');

      // 2. Créer les tables
      await this.dbService.query(`
        CREATE TABLE IF NOT EXISTS person (
          id INT PRIMARY KEY AUTO_INCREMENT,
          lastName VARCHAR(255) NOT NULL,
          firstName VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phoneNumber VARCHAR(20) NOT NULL
        );
      `);

      await this.dbService.query(`
        CREATE TABLE IF NOT EXISTS animal (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          dateOfBirth DATE NOT NULL,
          species VARCHAR(255) NOT NULL,
          breed VARCHAR(255) NOT NULL,
          color VARCHAR(255) NOT NULL,
          weight INT NOT NULL,
          ownerId INT,
          FOREIGN KEY (ownerId) REFERENCES person(id)
        );
      `);

      // 3. Insérer une seule personne et un seul animal pour tester
      await this.dbService.query(`
        INSERT INTO person (lastName, firstName, email, phoneNumber) VALUES
        ('Lee', 'Sarah', 'sarah.lee1@example.com', '555-0355');
      `);

      // 4. Vérifier l'ID de la personne insérée
      const [result] = await this.dbService.query('SELECT id FROM person');
      const personId = result[0].id;

      // 5. Insérer un animal avec cet ID
      await this.dbService.query(
        `
        INSERT INTO animal (name, dateOfBirth, species, breed, color, weight, ownerId) VALUES
        ('Bella', '2013-05-08', 'Turtle', 'Musk Turtle', 'Spotted', 18272, ?);
      `,
        [personId],
      );

      return { message: 'Database initialized successfully', personId };
    } catch (error) {
      return { error: error.message };
    }
  }
}
