import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnimalService } from './animal.service';
import { Animal } from './entities/animal.entity';
import { CreateAnimalInput } from './dto/create-animal.input';
import { UpdateAnimalInput } from './dto/update-animal.input';

@Resolver(() => Animal)
export class AnimalResolver {
  constructor(private readonly animalService: AnimalService) {}

  @Mutation(() => Animal)
  createAnimal(@Args('createAnimalInput') createAnimalInput: CreateAnimalInput) {
    return this.animalService.create(createAnimalInput);
  }

  @Query(() => [Animal], { name: 'animal' })
  findAll() {
    return this.animalService.findAll();
  }

  @Query(() => Animal, { name: 'animal' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.animalService.findOne(id);
  }

  @Mutation(() => Animal)
  updateAnimal(@Args('updateAnimalInput') updateAnimalInput: UpdateAnimalInput) {
    return this.animalService.update(updateAnimalInput.id, updateAnimalInput);
  }

  @Mutation(() => Animal)
  removeAnimal(@Args('id', { type: () => Int }) id: number) {
    return this.animalService.remove(id);
  }
}
