import { InputType, Field, registerEnumType } from '@nestjs/graphql';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});

export enum AnimalOrderField {
  id = 'id',
  name = 'name',
  dateOfBirth = 'dateOfBirth',
  species = 'species',
  breed = 'breed',
  color = 'color',
  weight = 'weight',
}

registerEnumType(AnimalOrderField, {
  name: 'AnimalOrderField',
});

@InputType()
export class OrderByInput {
  @Field(() => AnimalOrderField)
  field: AnimalOrderField;

  @Field(() => OrderDirection)
  direction: OrderDirection;
}
