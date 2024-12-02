// src/person/person.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ObjectType,
} from '@nestjs/graphql';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { Paginated } from '../common/pagination/pagination.type';
import { Animal } from '../animal/entities/animal.entity';
import { PersonModel } from './interfaces/person.interface';

@ObjectType()
export class PaginatedPerson extends Paginated(Person) {}

@Resolver(() => Person)
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

  @Query(() => PaginatedPerson, { name: 'persons' })
  async getPersons(@Args() paginationArgs: PaginationArgs) {
    const result = await this.personService.findAll(paginationArgs);
    return {
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        lastName: item.lastName,
        firstName: item.firstName,
        email: item.email,
        phoneNumber: item.phoneNumber,
      })),
    };
  }

  @Query(() => Person, { name: 'person' })
  async getPerson(@Args('id') id: number) {
    const person = await this.personService.findOne(id);
    return {
      id: person.id,
      lastName: person.lastName,
      firstName: person.firstName,
      email: person.email,
      phoneNumber: person.phoneNumber,
    };
  }

  @ResolveField('animals', () => [Animal])
  async getAnimals(@Parent() person: Person) {
    const animals = await this.personService.getAnimals(person.id);
    return animals.map((animal) => ({
      id: animal.id,
      name: animal.name,
      dateOfBirth: animal.dateOfBirth,
      species: animal.species,
      breed: animal.breed,
      color: animal.color,
      weight: animal.weight,
      ownerId: animal.ownerId,
    }));
  }

  @Mutation(() => Person)
  async createPerson(
    @Args('createPersonInput') createPersonInput: CreatePersonInput,
  ): Promise<Person> {
    const person = await this.personService.create(createPersonInput);
    return this.mapToGraphQL(person);
  }

  @Mutation(() => Person)
  async updatePerson(
    @Args('id') id: number,
    @Args('updatePersonInput') updatePersonInput: UpdatePersonInput,
  ): Promise<Person> {
    const person = await this.personService.update(id, updatePersonInput);
    return this.mapToGraphQL(person);
  }

  @Mutation(() => Person)
  async removePerson(@Args('id') id: number): Promise<Person> {
    const person = await this.personService.remove(id);
    return this.mapToGraphQL(person);
  }

  private mapToGraphQL(person: PersonModel): Person {
    return {
      id: person.id,
      lastName: person.lastName,
      firstName: person.firstName,
      email: person.email,
      phoneNumber: person.phoneNumber,
    };
  }
}
