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
import { PersonService } from './person.service';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { Person } from './entities/person.entity';
import { PersonModel } from './interfaces/person.interface';
import { Animal } from '../animal/entities/animal.entity';

@ApiTags('Persons')
@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  @ApiOperation({ summary: 'Get all persons' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of persons',
    type: [Person],
  })
  async findAll(): Promise<{
    items: PersonModel[];
    total: number;
    hasMore: boolean;
  }> {
    const result = await this.personService.findAll({ page: 1, take: 10 });
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

  @Get(':id')
  @ApiOperation({ summary: 'Get person by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Person ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a person by ID',
    type: Person,
  })
  async findOne(@Param('id') id: number): Promise<PersonModel> {
    const person = await this.personService.findOne(id);
    return {
      id: person.id,
      lastName: person.lastName,
      firstName: person.firstName,
      email: person.email,
      phoneNumber: person.phoneNumber,
    };
  }

  @Get(':id/animals')
  @ApiOperation({ summary: 'Get all animals owned by a person' })
  @ApiParam({ name: 'id', type: 'number', description: 'Person ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all animals owned by the person',
    type: [Animal],
  })
  async getAnimals(@Param('id') id: number): Promise<Animal[]> {
    const animals = await this.personService.getAnimals(id);
    const person = await this.personService.findOne(id);
    const owner: Person = {
      id: person.id,
      lastName: person.lastName,
      firstName: person.firstName,
      email: person.email,
      phoneNumber: person.phoneNumber,
    };

    return animals.map((animal) => ({
      id: animal.id,
      name: animal.name,
      dateOfBirth: animal.dateOfBirth,
      species: animal.species,
      breed: animal.breed,
      color: animal.color,
      weight: animal.weight,
      ownerId: animal.ownerId,
      owner,
    }));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new person' })
  @ApiBody({ type: CreatePersonInput })
  @ApiResponse({
    status: 201,
    description: 'The person has been successfully created',
    type: Person,
  })
  create(@Body() createPersonInput: CreatePersonInput): Promise<PersonModel> {
    return this.personService.create(createPersonInput);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a person' })
  @ApiParam({ name: 'id', type: 'number', description: 'Person ID' })
  @ApiBody({ type: UpdatePersonInput })
  @ApiResponse({
    status: 200,
    description: 'The person has been successfully updated',
    type: Person,
  })
  update(
    @Param('id') id: number,
    @Body() updatePersonInput: UpdatePersonInput,
  ): Promise<PersonModel> {
    return this.personService.update(id, updatePersonInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a person' })
  @ApiParam({ name: 'id', type: 'number', description: 'Person ID' })
  @ApiResponse({
    status: 200,
    description: 'The person has been successfully deleted',
    type: Person,
  })
  remove(@Param('id') id: number): Promise<PersonModel> {
    return this.personService.remove(id);
  }
}
