import { DatabaseService } from '../config/database.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../config/database.module';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  providers: [DatabaseService],
})
class ImportModule {}

async function importData() {
  const app = await NestFactory.createApplicationContext(ImportModule);
  const dbService = app.get(DatabaseService);

  try {
    console.log('Dropping existing tables...');
    await dbService.query('DROP TABLE IF EXISTS animal;');
    await dbService.query('DROP TABLE IF EXISTS person;');

    console.log('Creating tables...');
    await dbService.query(`
      CREATE TABLE IF NOT EXISTS person (
        id INT PRIMARY KEY AUTO_INCREMENT,
        lastName VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL
      );
    `);

    await dbService.query(`
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

    // Read the SQL file
    const sqlContent = fs.readFileSync(
      path.join(__dirname, '../../data-SQL.txt'),
      'utf8',
    );

    // Split the content into person and animal inserts
    const [personSection, animalSection] =
      sqlContent.split('INSERT INTO animal');

    // Process person data
    console.log('Importing person data...');
    const personValues = personSection
      .replace(
        'INSERT INTO person (lastName, firstName, email, phoneNumber) VALUES',
        '',
      )
      .trim();

    // Split into chunks of 100 records
    const personRows = personValues.split('),\n');
    const personChunkSize = 100;

    for (let i = 0; i < personRows.length; i += personChunkSize) {
      const chunk = personRows.slice(i, i + personChunkSize);
      const chunkQuery = `
        INSERT INTO person (lastName, firstName, email, phoneNumber) VALUES 
        ${chunk.join('),\n')}${!chunk[chunk.length - 1].endsWith(';') ? ');' : ''}
      `;
      await dbService.query(chunkQuery);
      console.log(
        `Imported persons ${i + 1} to ${Math.min(i + personChunkSize, personRows.length)}`,
      );
    }

    // Process animal data
    console.log('Importing animal data...');
    const animalValues = ('INSERT INTO animal' + animalSection).trim();
    const animalRows = animalValues
      .replace(
        'INSERT INTO animal (name, dateOfBirth, species, breed, color, weight, ownerId) VALUES',
        '',
      )
      .trim()
      .split('),\n');

    const animalChunkSize = 100;

    for (let i = 0; i < animalRows.length; i += animalChunkSize) {
      const chunk = animalRows.slice(i, i + animalChunkSize);
      const chunkQuery = `
        INSERT INTO animal (name, dateOfBirth, species, breed, color, weight, ownerId) VALUES 
        ${chunk.join('),\n')}${!chunk[chunk.length - 1].endsWith(';') ? ');' : ''}
      `;
      await dbService.query(chunkQuery);
      console.log(
        `Imported animals ${i + 1} to ${Math.min(i + animalChunkSize, animalRows.length)}`,
      );
    }

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await app.close();
  }
}

importData();
