// src/animal/dto/create-animal.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsDate, Min } from 'class-validator';

@InputType()
export class CreateAnimalInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsDate()
  dateOfBirth: Date;

  @Field()
  @IsString()
  species: string;

  @Field()
  @IsString()
  breed: string;

  @Field()
  @IsString()
  color: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  weight: number;

  @Field(() => Int)
  @IsInt()
  ownerId: number;
}
