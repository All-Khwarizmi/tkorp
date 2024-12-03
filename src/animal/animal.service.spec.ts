import { Test, TestingModule } from '@nestjs/testing';
import { AnimalService } from './animal.service';
import { DatabaseService } from '../config/database.service';
import { CreateAnimalInput } from './dto/create-animal.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import {
  OrderByInput,
  AnimalOrderField,
  OrderDirection,
} from './dto/order-by.input';

// Fixtures
const mockAnimal = {
  id: 1,
  name: 'Rex',
  dateOfBirth: new Date('2020-01-01'),
  species: 'Dog',
  breed: 'German Shepherd',
  color: 'Brown',
  weight: 30,
  ownerId: 1,
};

const mockAnimals = [
  mockAnimal,
  {
    id: 2,
    name: 'Whiskers',
    dateOfBirth: new Date('2019-05-15'),
    species: 'Cat',
    breed: 'Persian',
    color: 'White',
    weight: 5,
    ownerId: 2,
  },
];

const mockDatabaseService = {
  query: jest.fn(),
};

describe('AnimalService', () => {
  let service: AnimalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<AnimalService>(AnimalService);
    jest.clearAllMocks();
  });

  describe('CRUD Operations', () => {
    describe('create', () => {
      it('should create a new animal', async () => {
        const createAnimalInput: CreateAnimalInput = {
          name: 'Rex',
          dateOfBirth: new Date('2020-01-01'),
          species: 'Dog',
          breed: 'German Shepherd',
          color: 'Brown',
          weight: 30,
          ownerId: 1,
        };

        mockDatabaseService.query
          .mockResolvedValueOnce([[{ insertId: 1 }]])
          .mockResolvedValueOnce([[mockAnimal]]);

        const result = await service.create(createAnimalInput);
        expect(result).toEqual(mockAnimal);
        expect(mockDatabaseService.query).toHaveBeenCalledTimes(2);
      });
    });

    describe('findAll', () => {
      it('should return paginated animals with total count', async () => {
        const paginationArgs: PaginationArgs = { page: 1, take: 10 };
        const orderBy: OrderByInput = {
          field: AnimalOrderField.name,
          direction: OrderDirection.ASC,
        };

        mockDatabaseService.query
          .mockResolvedValueOnce([mockAnimals])
          .mockResolvedValueOnce([[{ total: 2 }]]);

        const result = await service.findAll(paginationArgs, orderBy);

        expect(result).toEqual({
          items: mockAnimals,
          total: 2,
          hasMore: false,
        });
        expect(mockDatabaseService.query).toHaveBeenCalledTimes(2);
      });

      it('should handle empty results', async () => {
        const paginationArgs: PaginationArgs = { page: 1, take: 10 };

        mockDatabaseService.query
          .mockResolvedValueOnce([[]])
          .mockResolvedValueOnce([[{ total: 0 }]]);

        const result = await service.findAll(paginationArgs);

        expect(result).toEqual({
          items: [],
          total: 0,
          hasMore: false,
        });
      });
    });

    describe('findOne', () => {
      it('should return an animal by id', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([[mockAnimal]]);

        const result = await service.findOne(1);
        expect(result).toEqual(mockAnimal);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM animal WHERE id = ?',
          [1],
        );
      });
    });
  });

  describe('Statistics', () => {
    describe('getMostCommonSpecies', () => {
      it('should return species count statistics', async () => {
        const mockStats = [
          { species: 'Dog', count: 3 },
          { species: 'Cat', count: 2 },
        ];

        mockDatabaseService.query.mockResolvedValueOnce([mockStats]);

        const result = await service.getMostCommonSpecies();
        expect(result).toEqual(mockStats);
      });
    });

    describe('getOldestAnimal', () => {
      it('should return the oldest animal', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([[mockAnimal]]);

        const result = await service.getOldestAnimal();
        expect(result).toEqual(mockAnimal);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM animal ORDER BY dateOfBirth ASC LIMIT 1',
        );
      });
    });

    describe('getHeaviestAnimal', () => {
      it('should return the heaviest animal', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([[mockAnimal]]);

        const result = await service.getHeaviestAnimal();
        expect(result).toEqual(mockAnimal);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM animal ORDER BY weight DESC LIMIT 1',
        );
      });
    });
  });

  describe('Specialized Searches', () => {
    describe('getAnimalsBySpecies', () => {
      it('should return animals of a specific species', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([mockAnimals]);

        const result = await service.getAnimalsBySpecies('Dog');
        expect(result).toEqual(mockAnimals);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM animal WHERE species = ?',
          ['Dog'],
        );
      });
    });

    describe('getAnimalsByOwner', () => {
      it('should return animals for a specific owner', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([mockAnimals]);

        const result = await service.getAnimalsByOwner(1);
        expect(result).toEqual(mockAnimals);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM animal WHERE ownerId = ?',
          [1],
        );
      });
    });
  });
});
