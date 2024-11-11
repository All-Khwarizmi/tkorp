// apps/api/src/users/users.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../config/database.config';
import { CreateUserDto } from './users.controller';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_POOL) private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query('SELECT * FROM users');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    return result.rows[0];
  }

  async create(createUserDto: CreateUserDto) {
    const result = await this.pool.query(
      'INSERT INTO users (name, email, status) VALUES ($1, $2, $3) RETURNING *',
      [createUserDto.name, createUserDto.email, createUserDto.status],
    );
    return result.rows[0];
  }
}
