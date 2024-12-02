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
    const dbUrl = this.configService.get<string>('DATABASE_URL');
    const connectionConfig = this.parseConnectionString(dbUrl);
    this.pool = createPool(connectionConfig);
  }

  private parseConnectionString(connectionString: string) {
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Support both mysql:// and postgresql:// URLs
    const matches = connectionString.match(
      /(mysql|postgresql):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/,
    );

    if (!matches) {
      throw new Error('Invalid connection string format');
    }

    const [, protocol, user, password, host, port, database] = matches;

    // If it's a PostgreSQL URL, convert it to MySQL format
    if (protocol === 'postgresql') {
      console.log('Converting PostgreSQL connection string to MySQL format');
    }

    return {
      host,
      port: parseInt(port, 10),
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
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
