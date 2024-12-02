import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalResolver } from './animal.resolver';

@Module({
  providers: [AnimalResolver, AnimalService],
})
export class AnimalModule {}
