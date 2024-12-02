import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';

@ObjectType()
export class AnimalSpeciesCount {
  @Field()
  species: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class OwnershipStats {
  @Field(() => Person)
  owner: Person;

  @Field(() => Int)
  animalCount: number;
}

@ObjectType()
export class OwnerWeightStats {
  @Field(() => Person)
  owner: Person;

  @Field(() => Int)
  animalCount: number;

  @Field(() => Float)
  totalWeight: number;
}
