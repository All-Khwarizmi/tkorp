// src/person/person.module.ts
import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonResolver } from './person.resolver';
import { DatabaseModule } from '../config/database.module';

@Module({
  imports: [DatabaseModule], // Ajouter cette ligne
  providers: [PersonResolver, PersonService],
})
export class PersonModule {}
