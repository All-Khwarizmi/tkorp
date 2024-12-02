import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';

@ObjectType()
export class Animal {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  species: string;

  @Field()
  breed: string;

  @Field()
  color: string;

  @Field()
  weight: number;

  @Field(() => Person)
  owner: Person;

  @Field()
  ownerId: number;
}
