// src/person/dto/create-person.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, Matches, MinLength } from 'class-validator';

@InputType()
export class CreatePersonInput {
  @Field()
  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty' })
  lastName: string;

  @Field()
  @IsString()
  @MinLength(1, { message: 'First name cannot be empty' })
  firstName: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;
}
