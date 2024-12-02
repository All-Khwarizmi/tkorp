import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnimalInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
