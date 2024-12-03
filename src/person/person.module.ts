import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonResolver } from './person.resolver';
import { PersonController } from './person.controller';
import { DatabaseModule } from '../config/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PersonResolver, PersonService],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}
