import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export async function initializeDb() {
  console.log('Using connection string:', process.env.DATABASE_URL);

  const pool = createPool(process.env.DATABASE_URL);

  try {
    console.log('Testing connection...');
    await pool.query('SELECT 1');
    console.log('Connection successful');

    // Création des tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS person (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lastName VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS animal (
        id INT AUTO_INCREMENT PRIMARY KEY,
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

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  initializeDb().catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
}
