// src/animal/animal.module.ts
import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalResolver } from './animal.resolver';
import { DatabaseModule } from '../config/database.module';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [DatabaseModule, PersonModule],
  providers: [AnimalResolver, AnimalService],
})
export class AnimalModule {}
