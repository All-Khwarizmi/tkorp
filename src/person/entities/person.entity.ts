import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Animal } from '../../animal/entities/animal.entity';

@ObjectType()
export class Person {
  @Field(() => ID)
  id: number;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field(() => [Animal], { nullable: true })
  animals?: Animal[];
}
