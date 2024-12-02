import { Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const DATABASE_POOL = 'DATABASE_POOL';

const databasePoolFactory = async (configService: ConfigService) => {
  const databaseUrl = configService.get<string>('DATABASE_URL');
  console.log('Using connection string:', databaseUrl);

  return createPool(databaseUrl);
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
