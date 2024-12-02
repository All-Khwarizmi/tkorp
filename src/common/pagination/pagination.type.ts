// src/common/pagination/pagination.type.ts
import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface IPaginatedType<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Page`)
  class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef])
    items: T[];

    @Field()
    total: number;

    @Field()
    hasMore: boolean;
  }
  return PaginatedType;
}
