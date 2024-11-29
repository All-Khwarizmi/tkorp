// apps/api/src/config/database.config.ts
import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const DATABASE_POOL = 'DATABASE_POOL';

const databasePoolFactory = async (configService: ConfigService) => {
  return new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    ssl: false
  });
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_POOL,
      inject: [ConfigService],
      useFactory: databasePoolFactory,
    },
  ],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
