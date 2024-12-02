// database.service.ts
import { Injectable } from '@nestjs/common';
import {
  createPool,
  OkPacket,
  Pool,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = createPool(configService.get<string>('DATABASE_URL'));
  }

  async query<T extends RowDataPacket[] | ResultSetHeader | OkPacket>(
    sql: string,
    params?: any[],
  ): Promise<[T, any]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<T>(sql, params);
      return [rows, null];
    } finally {
      connection.release();
    }
  }
}
