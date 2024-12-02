// src/person/person.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../config/database.service';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface PersonRow extends RowDataPacket {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
}

@Injectable()
export class PersonService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createPersonInput: CreatePersonInput) {
    const [result] = await this.dbService.query<ResultSetHeader>(
      'INSERT INTO person (lastName, firstName, email, phoneNumber) VALUES (?, ?, ?, ?)',
      [
        createPersonInput.lastName,
        createPersonInput.firstName,
        createPersonInput.email,
        createPersonInput.phoneNumber,
      ],
    );
    return this.findOne(result.insertId);
  }

  async findAll(paginationArgs: PaginationArgs) {
    const offset = (paginationArgs.page - 1) * paginationArgs.take;

    const [rows] = await this.dbService.query<PersonRow[]>(
      'SELECT * FROM person LIMIT ? OFFSET ?',
      [paginationArgs.take, offset],
    );

    const [countResult] = await this.dbService.query<PersonRow[]>(
      'SELECT COUNT(*) as total FROM person',
    );

    const total = countResult[0].total;
    const hasMore = offset + paginationArgs.take < total;

    return {
      items: rows,
      total,
      hasMore,
    };
  }

  async findOne(id: number) {
    const [rows] = await this.dbService.query<PersonRow[]>(
      'SELECT * FROM person WHERE id = ?',
      [id],
    );
    return rows[0];
  }

  async update(id: number, updatePersonInput: UpdatePersonInput) {
    await this.dbService.query<ResultSetHeader>(
      'UPDATE person SET lastName = ?, firstName = ?, email = ?, phoneNumber = ? WHERE id = ?',
      [
        updatePersonInput.lastName,
        updatePersonInput.firstName,
        updatePersonInput.email,
        updatePersonInput.phoneNumber,
        id,
      ],
    );
    return this.findOne(id);
  }

  async remove(id: number) {
    const person = await this.findOne(id);
    await this.dbService.query<ResultSetHeader>(
      'DELETE FROM person WHERE id = ?',
      [id],
    );
    return person;
  }

  async getAnimals(personId: number) {
    const [rows] = await this.dbService.query<RowDataPacket[]>(
      'SELECT * FROM animal WHERE ownerId = ?',
      [personId],
    );
    return rows;
  }
}
