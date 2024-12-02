// database.service.ts
import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = createPool(configService.get<string>('DATABASE_URL'));
  }

  async query(text: string, params?: any[]) {
    const connection = await this.pool.getConnection();
    try {
      return await connection.query(text, params);
    } finally {
      connection.release();
    }
  }
}
