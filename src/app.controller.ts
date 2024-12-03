// apps/api/src/app.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './config/database.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: DatabaseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Returns the welcome message',
  })
  getHello(): string {
    return 'Welcome to the Pet Management API! Visit /graphql api documentation.';
  }

  @Post('init-db')
  @ApiOperation({ summary: 'Initialize database with sample data' })
  @ApiResponse({
    status: 200,
    description: 'Database initialized successfully with sample data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error initializing database',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  })
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

      // 3. Insert the data
      const personInsertQuery = `
        INSERT INTO person (lastName, firstName, email, phoneNumber) VALUES
        ('Lee', 'Sarah', 'sarah.lee1@example.com', '555-0355'),
        ('Doe', 'Chris', 'chris.doe2@example.com', '555-0332'),
        ('Doe', 'Jane', 'jane.doe3@example.com', '555-0394'),
        ('Doe', 'Michael', 'michael.doe4@example.com', '555-0144'),
        ('Walker', 'Sarah', 'sarah.walker5@example.com', '555-0391'),
        ('Walker', 'Sarah', 'sarah.walker6@example.com', '555-0347'),
        ('Johnson', 'Michael', 'michael.johnson7@example.com', '555-0143'),
        ('Lee', 'Chris', 'chris.lee8@example.com', '555-0741'),
        ('Johnson', 'Emma', 'emma.johnson9@example.com', '555-0401'),
        ('Lee', 'Emily', 'emily.lee10@example.com', '555-0658')
      `;

      await this.dbService.query(personInsertQuery);

      const animalInsertQuery = `
        INSERT INTO animal (name, dateOfBirth, species, breed, color, weight, ownerId) VALUES
        ('Bella','2013-05-08','Turtle','Musk Turtle', 'Spotted', '18272', '1'),
        ('Luna','2020-12-07','Turtle','Box Turtle', 'Striped', '47483', '2'),
        ('Luna','2023-08-12','Turtle','Musk Turtle', 'Brown', '44540', '3'),
        ('Chloe','2017-09-08','Bird','Parrot', 'Striped', '18462', '4'),
        ('Bella','2014-07-19','Turtle','Musk Turtle', 'Multicolor', '16812', '5'),
        ('Bella','2017-06-30','Dog','Beagle', 'Gray', '15673', '6'),
        ('Daisy','2022-06-10','Rabbit','Netherland Dwarf', 'Spotted', '48234', '7'),
        ('Milo','2018-01-04','Hamster','Syrian', 'Gray', '35819', '8'),
        ('Charlie','2017-01-26','Rabbit','Mini Rex', 'Spotted', '48922', '9'),
        ('Max','2024-03-15','Turtle','Musk Turtle', 'Black', '32483', '10')
      `;

      await this.dbService.query(animalInsertQuery);

      return { message: 'Database initialized successfully with sample data' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
