// src/animal/animal.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ObjectType,
  Int,
} from '@nestjs/graphql';
import { AnimalService } from './animal.service';
import { Animal } from './entities/animal.entity';
import { CreateAnimalInput } from './dto/create-animal.input';
import { UpdateAnimalInput } from './dto/update-animal.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { Paginated } from '../common/pagination/pagination.type';
import { Person } from '../person/entities/person.entity';
import { PersonService } from '../person/person.service';
import { AnimalModel } from './interfaces/animal.interface';

@ObjectType()
export class PaginatedAnimal extends Paginated(Animal) {}

@Resolver(() => Animal)
export class AnimalResolver {
  constructor(
    private readonly animalService: AnimalService,
    private readonly personService: PersonService,
  ) {}

  @Query(() => PaginatedAnimal, { name: 'animals' })
  async getAnimals(@Args() paginationArgs: PaginationArgs) {
    const result = await this.animalService.findAll(paginationArgs);
    return {
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        name: item.name,
        dateOfBirth: item.dateOfBirth,
        species: item.species,
        breed: item.breed,
        color: item.color,
        weight: item.weight,
        ownerId: item.ownerId,
      })),
    };
  }

  @Query(() => Animal, { name: 'animal' })
  async getAnimal(@Args('id', { type: () => Int }) id: number) {
    const animal = await this.animalService.findOne(id);
    return this.mapToGraphQL(animal);
  }

  @Mutation(() => Animal)
  async createAnimal(
    @Args('createAnimalInput') createAnimalInput: CreateAnimalInput,
  ) {
    const animal = await this.animalService.create(createAnimalInput);
    return this.mapToGraphQL(animal);
  }

  @Mutation(() => Animal)
  async updateAnimal(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateAnimalInput') updateAnimalInput: UpdateAnimalInput,
  ) {
    const animal = await this.animalService.update(id, updateAnimalInput);
    return this.mapToGraphQL(animal);
  }

  @Mutation(() => Animal)
  async removeAnimal(@Args('id', { type: () => Int }) id: number) {
    const animal = await this.animalService.remove(id);
    return this.mapToGraphQL(animal);
  }

  @ResolveField('owner', () => Person)
  async getOwner(@Parent() animal: Animal): Promise<Person> {
    const owner = await this.personService.findOne(animal.ownerId);
    return {
      id: owner.id,
      lastName: owner.lastName,
      firstName: owner.firstName,
      email: owner.email,
      phoneNumber: owner.phoneNumber,
    };
  }

  private async mapToGraphQL(animal: AnimalModel): Promise<Animal> {
    const owner = await this.personService.findOne(animal.ownerId);
    return {
      id: animal.id,
      name: animal.name,
      dateOfBirth: animal.dateOfBirth,
      species: animal.species,
      breed: animal.breed,
      color: animal.color,
      weight: animal.weight,
      ownerId: animal.ownerId,
      owner: {
        id: owner.id,
        lastName: owner.lastName,
        firstName: owner.firstName,
        email: owner.email,
        phoneNumber: owner.phoneNumber,
      },
    };
  }
}
