// src/person/dto/create-person.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

@InputType()
export class CreatePersonInput {
  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsPhoneNumber()
  phoneNumber: string;
}
