import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalResolver } from './animal.resolver';
import { AnimalController } from './animal.controller';
import { DatabaseModule } from '../config/database.module';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [DatabaseModule, PersonModule],
  providers: [AnimalResolver, AnimalService],
  controllers: [AnimalController],
  exports: [AnimalService],
})
export class AnimalModule {}
