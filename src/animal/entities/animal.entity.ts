import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Animal {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
