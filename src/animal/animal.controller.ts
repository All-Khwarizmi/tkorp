import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AnimalService } from './animal.service';
import { CreateAnimalInput } from './dto/create-animal.input';
import { UpdateAnimalInput } from './dto/update-animal.input';
import { Animal } from './entities/animal.entity';
import {
  AnimalSpeciesCount,
  OwnershipStats,
  OwnerWeightStats,
} from './dto/stats.types';
import { AnimalModel } from './interfaces/animal.interface';
import { Person } from '../person/entities/person.entity';

@ApiTags('Animals')
@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Get()
  @ApiOperation({ summary: 'Get all animals' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of animals',
    type: [Animal],
  })
  async findAll(): Promise<{
    items: AnimalModel[];
    total: number;
    hasMore: boolean;
  }> {
    const result = await this.animalService.findAll({ page: 1, take: 10 });
    return result;
  }

  @Get('most-common-species')
  @ApiOperation({ summary: 'Get most common species statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns statistics about most common species',
    type: [AnimalSpeciesCount],
  })
  getMostCommonSpecies(): Promise<AnimalSpeciesCount[]> {
    return this.animalService.getMostCommonSpecies();
  }

  @Get('oldest')
  @ApiOperation({ summary: 'Get the oldest animal' })
  @ApiResponse({
    status: 200,
    description: 'Returns the oldest animal',
    type: Animal,
  })
  getOldestAnimal(): Promise<AnimalModel> {
    return this.animalService.getOldestAnimal();
  }

  @Get('heaviest')
  @ApiOperation({ summary: 'Get the heaviest animal' })
  @ApiResponse({
    status: 200,
    description: 'Returns the heaviest animal',
    type: Animal,
  })
  getHeaviestAnimal(): Promise<AnimalModel> {
    return this.animalService.getHeaviestAnimal();
  }

  @Get('top-owner')
  @ApiOperation({ summary: 'Get owner with most animals' })
  @ApiResponse({
    status: 200,
    description: 'Returns the owner with the most animals',
    type: OwnershipStats,
  })
  async getTopOwner(): Promise<OwnershipStats> {
    const [topOwnerStats] = await this.animalService.getTopOwners();
    const ownerData = await this.animalService.getOwner(topOwnerStats.ownerId);
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

  @Get('heaviest-pets-owner')
  @ApiOperation({ summary: 'Get owner with heaviest pets' })
  @ApiResponse({
    status: 200,
    description: 'Returns the owner with the heaviest total pet weight',
    type: OwnerWeightStats,
  })
  async getOwnerWithHeaviestPets(): Promise<OwnerWeightStats> {
    const [ownerStats] = await this.animalService.getOwnersByTotalPetWeight();
    const ownerData = await this.animalService.getOwner(ownerStats.ownerId);
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

  @Get(':id')
  @ApiOperation({ summary: 'Get animal by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Animal ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns an animal by ID',
    type: Animal,
  })
  findOne(@Param('id') id: number): Promise<AnimalModel> {
    return this.animalService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new animal' })
  @ApiBody({ type: CreateAnimalInput })
  @ApiResponse({
    status: 201,
    description: 'The animal has been successfully created',
    type: Animal,
  })
  create(@Body() createAnimalInput: CreateAnimalInput): Promise<AnimalModel> {
    return this.animalService.create(createAnimalInput);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an animal' })
  @ApiParam({ name: 'id', type: 'number', description: 'Animal ID' })
  @ApiBody({ type: UpdateAnimalInput })
  @ApiResponse({
    status: 200,
    description: 'The animal has been successfully updated',
    type: Animal,
  })
  async update(
    @Param('id') id: number,
    @Body() updateAnimalInput: UpdateAnimalInput,
  ): Promise<AnimalModel> {
    return Promise.resolve(this.animalService.update(id, updateAnimalInput));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an animal' })
  @ApiParam({ name: 'id', type: 'number', description: 'Animal ID' })
  @ApiResponse({
    status: 200,
    description: 'The animal has been successfully deleted',
    type: Animal,
  })
  async remove(@Param('id') id: number): Promise<AnimalModel> {
    return Promise.resolve(this.animalService.remove(id));
  }
}
