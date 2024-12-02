import { Test, TestingModule } from '@nestjs/testing';
import { AnimalResolver } from './animal.resolver';
import { AnimalService } from './animal.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../config/database.service';
import { PersonService } from '../person/person.service';

const mockAnimalService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockPersonService = {
  findOne: jest.fn(),
};

const mockDatabaseService = {
  query: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('AnimalResolver', () => {
  let resolver: AnimalResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalResolver,
        {
          provide: AnimalService,
          useValue: mockAnimalService,
        },
        {
          provide: PersonService,
          useValue: mockPersonService,
        },
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    resolver = module.get<AnimalResolver>(AnimalResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
