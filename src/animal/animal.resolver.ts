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
import { OrderByInput } from './dto/order-by.input';
import {
  AnimalSpeciesCount,
  OwnershipStats,
  OwnerWeightStats,
} from './dto/stats.types';

@ObjectType()
export class PaginatedAnimal extends Paginated(Animal) {}

@Resolver(() => Animal)
export class AnimalResolver {
  constructor(
    private readonly animalService: AnimalService,
    private readonly personService: PersonService,
  ) {}

  @Query(() => PaginatedAnimal, { name: 'animals' })
  async getAnimals(
    @Args() paginationArgs: PaginationArgs,
    @Args('orderBy', { nullable: true }) orderBy?: OrderByInput,
  ) {
    const result = await this.animalService.findAll(paginationArgs, orderBy);
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

  @Query(() => [AnimalSpeciesCount], { name: 'mostCommonSpecies' })
  async getMostCommonSpecies() {
    return this.animalService.getMostCommonSpecies();
  }

  @Query(() => OwnershipStats, { name: 'topOwner' })
  async getTopOwner() {
    const [topOwnerStats] = await this.animalService.getTopOwners();
    const ownerData = await this.personService.findOne(topOwnerStats.ownerId);
    const owner: Person = {
      id: ownerData.id,
      lastName: ownerData.lastName,
      firstName: ownerData.firstName,
      email: ownerData.email,
      phoneNumber: ownerData.phoneNumber,
    };
    return {
      owner,
      animalCount: topOwnerStats.animalCount,
    };
  }

  @Query(() => OwnershipStats, { name: 'topCatOwner' })
  async getTopCatOwner() {
    const [topCatOwnerStats] = await this.animalService.getTopCatOwners();
    const ownerData = await this.personService.findOne(
      topCatOwnerStats.ownerId,
    );
    const owner: Person = {
      id: ownerData.id,
      lastName: ownerData.lastName,
      firstName: ownerData.firstName,
      email: ownerData.email,
      phoneNumber: ownerData.phoneNumber,
    };
    return {
      owner,
      animalCount: topCatOwnerStats.animalCount,
    };
  }

  @Query(() => OwnerWeightStats, { name: 'ownerWithHeaviestPets' })
  async getOwnerWithHeaviestPets() {
    const [ownerStats] = await this.animalService.getOwnersByTotalPetWeight();
    const ownerData = await this.personService.findOne(ownerStats.ownerId);
    const owner: Person = {
      id: ownerData.id,
      lastName: ownerData.lastName,
      firstName: ownerData.firstName,
      email: ownerData.email,
      phoneNumber: ownerData.phoneNumber,
    };
    return {
      owner,
      animalCount: ownerStats.animalCount,
      totalWeight: ownerStats.totalWeight || 0,
    };
  }

  @Query(() => Animal, { name: 'oldestAnimal' })
  async getOldestAnimal() {
    const animal = await this.animalService.getOldestAnimal();
    return this.mapToGraphQL(animal);
  }

  @Query(() => Animal, { name: 'heaviestAnimal' })
  async getHeaviestAnimal() {
    const animal = await this.animalService.getHeaviestAnimal();
    return this.mapToGraphQL(animal);
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
    const ownerData = await this.personService.findOne(animal.ownerId);
    return {
      id: ownerData.id,
      lastName: ownerData.lastName,
      firstName: ownerData.firstName,
      email: ownerData.email,
      phoneNumber: ownerData.phoneNumber,
    };
  }

  private async mapToGraphQL(animal: AnimalModel): Promise<Animal> {
    const ownerData = await this.personService.findOne(animal.ownerId);
    const owner: Person = {
      id: ownerData.id,
      lastName: ownerData.lastName,
      firstName: ownerData.firstName,
      email: ownerData.email,
      phoneNumber: ownerData.phoneNumber,
    };
    return {
      id: animal.id,
      name: animal.name,
      dateOfBirth: animal.dateOfBirth,
      species: animal.species,
      breed: animal.breed,
      color: animal.color,
      weight: animal.weight,
      ownerId: animal.ownerId,
      owner,
    };
  }
}
