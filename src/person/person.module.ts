// src/person/person.module.ts
import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonResolver } from './person.resolver';
import { DatabaseModule } from '../config/database.module';

// src/person/person.module.ts
@Module({
  imports: [DatabaseModule],
  providers: [PersonResolver, PersonService],
  exports: [PersonService], // Ajoutez cette ligne
})
export class PersonModule {}
