import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../config/database.service';
import { CreateAnimalInput } from './dto/create-animal.input';
import { UpdateAnimalInput } from './dto/update-animal.input';
import { AnimalModel } from './interfaces/animal.interface';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { OrderByInput } from './dto/order-by.input';

interface AnimalRow extends RowDataPacket {
  id: number;
  name: string;
  dateOfBirth: Date;
  species: string;
  breed: string;
  color: string;
  weight: number;
  ownerId: number;
}

@Injectable()
export class AnimalService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createAnimalInput: CreateAnimalInput): Promise<AnimalModel> {
    const [result] = await this.dbService.query<ResultSetHeader>(
      'INSERT INTO animal (name, dateOfBirth, species, breed, color, weight, ownerId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        createAnimalInput.name,
        createAnimalInput.dateOfBirth,
        createAnimalInput.species,
        createAnimalInput.breed,
        createAnimalInput.color,
        createAnimalInput.weight,
        createAnimalInput.ownerId,
      ],
    );
    return this.findOne(result.insertId);
  }

  async findAll(paginationArgs: PaginationArgs, orderBy?: OrderByInput) {
    const offset = (paginationArgs.page - 1) * paginationArgs.take;
    let query = 'SELECT * FROM animal';

    if (orderBy) {
      query += ` ORDER BY ${orderBy.field} ${orderBy.direction}`;
    }

    query += ' LIMIT ? OFFSET ?';

    const [rows] = await this.dbService.query<AnimalRow[]>(query, [
      paginationArgs.take,
      offset,
    ]);

    const [countResult] = await this.dbService.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM animal',
    );

    const total = countResult[0].total;
    const hasMore = offset + paginationArgs.take < total;

    return {
      items: rows,
      total,
      hasMore,
    };
  }

  async findOne(id: number): Promise<AnimalModel> {
    const [rows] = await this.dbService.query<AnimalRow[]>(
      'SELECT * FROM animal WHERE id = ?',
      [id],
    );
    return this.mapToModel(rows[0]);
  }

  private mapToModel(row: AnimalRow): AnimalModel {
    return {
      id: row.id,
      name: row.name,
      dateOfBirth: row.dateOfBirth,
      species: row.species,
      breed: row.breed,
      color: row.color,
      weight: row.weight,
      ownerId: row.ownerId,
    };
  }

  update(id: number, updateAnimalInput: UpdateAnimalInput) {
    return {
      id: id,
      name: updateAnimalInput.name,
      dateOfBirth: updateAnimalInput.dateOfBirth,
      species: updateAnimalInput.species,
      breed: updateAnimalInput.breed,
      color: updateAnimalInput.color,
      weight: updateAnimalInput.weight,
      ownerId: updateAnimalInput.ownerId,
    };
  }

  remove(id: number) {
    return {
      id: id,
      name: '',
      dateOfBirth: new Date(),
      species: '',
      breed: '',
      color: '',
      weight: 0,
      ownerId: 0,
    };
  }

  async getAnimals(personId: number) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE ownerId = ?',
      [personId],
    );
    return rows;
  }

  async getAnimal(id: number) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE id = ?',
      [id],
    );
    return rows[0];
  }

  async getOwner(id: number) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM person WHERE id = ?',
      [id],
    );
    return rows[0];
  }

  async getAnimalsByOwner(ownerId: number) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE ownerId = ?',
      [ownerId],
    );
    return rows;
  }

  async getAnimalsBySpecies(species: string) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE species = ?',
      [species],
    );
    return rows;
  }

  async getAnimalsByBreed(breed: string) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE breed = ?',
      [breed],
    );
    return rows;
  }

  async getAnimalsByColor(color: string) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE color = ?',
      [color],
    );
    return rows;
  }

  async getAnimalsByWeight(weight: number) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE weight = ?',
      [weight],
    );
    return rows;
  }

  async getAnimalsByDateOfBirth(dateOfBirth: Date) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE dateOfBirth = ?',
      [dateOfBirth],
    );
    return rows;
  }

  async getAnimalsByName(name: string) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE name = ?',
      [name],
    );
    return rows;
  }

  async getAnimalsByOwnerId(ownerId: number) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE ownerId = ?',
      [ownerId],
    );
    return rows;
  }
}
