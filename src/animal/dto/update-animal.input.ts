// src/animal/dto/update-animal.input.ts
import { CreateAnimalInput } from './create-animal.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnimalInput extends PartialType(CreateAnimalInput) {}
