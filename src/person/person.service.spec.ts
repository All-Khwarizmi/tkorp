import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { DatabaseService } from '../config/database.service';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PaginationArgs } from '../common/pagination/pagination.args';

// Fixtures
const mockPerson = {
  id: 1,
  lastName: 'Doe',
  firstName: 'John',
  email: 'john.doe@example.com',
  phoneNumber: '1234567890',
};

const mockPersons = [
  mockPerson,
  {
    id: 2,
    lastName: 'Smith',
    firstName: 'Jane',
    email: 'jane.smith@example.com',
    phoneNumber: '0987654321',
  },
];

const mockAnimals = [
  {
    id: 1,
    name: 'Rex',
    species: 'Dog',
    breed: 'German Shepherd',
    ownerId: 1,
  },
];

const mockDatabaseService = {
  query: jest.fn(),
};

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    jest.clearAllMocks();
  });

  describe('CRUD Operations', () => {
    describe('create', () => {
      it('should create a new person', async () => {
        const createPersonInput: CreatePersonInput = {
          lastName: 'Doe',
          firstName: 'John',
          email: 'john.doe@example.com',
          phoneNumber: '1234567890',
        };

        mockDatabaseService.query
          .mockResolvedValueOnce([[{ insertId: 1 }]])
          .mockResolvedValueOnce([[mockPerson]]);

        const result = await service.create(createPersonInput);
        expect(result).toEqual(mockPerson);
        expect(mockDatabaseService.query).toHaveBeenCalledTimes(2);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'INSERT INTO person (lastName, firstName, email, phoneNumber) VALUES (?, ?, ?, ?)',
          ['Doe', 'John', 'john.doe@example.com', '1234567890'],
        );
      });
    });

    describe('findAll', () => {
      it('should return paginated persons with total count', async () => {
        const paginationArgs: PaginationArgs = { page: 1, take: 10 };

        mockDatabaseService.query
          .mockResolvedValueOnce([mockPersons])
          .mockResolvedValueOnce([[{ total: 2 }]]);

        const result = await service.findAll(paginationArgs);

        expect(result).toEqual({
          items: mockPersons,
          total: 2,
          hasMore: false,
        });
        expect(mockDatabaseService.query).toHaveBeenCalledTimes(2);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM person LIMIT ? OFFSET ?',
          [10, 0],
        );
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

      it('should calculate offset correctly for different pages', async () => {
        const paginationArgs: PaginationArgs = { page: 2, take: 5 };

        mockDatabaseService.query
          .mockResolvedValueOnce([mockPersons])
          .mockResolvedValueOnce([[{ total: 7 }]]);

        await service.findAll(paginationArgs);

        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM person LIMIT ? OFFSET ?',
          [5, 5],
        );
      });
    });

    describe('findOne', () => {
      it('should return a person by id', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([[mockPerson]]);

        const result = await service.findOne(1);
        expect(result).toEqual(mockPerson);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM person WHERE id = ?',
          [1],
        );
      });

      it('should return undefined when person not found', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([[]]);

        const result = await service.findOne(999);
        expect(result).toBeUndefined();
      });
    });

    describe('update', () => {
      it('should update and return the updated person', async () => {
        const updatePersonInput: UpdatePersonInput = {
          lastName: 'Doe Updated',
          firstName: 'John',
          email: 'john.updated@example.com',
          phoneNumber: '9999999999',
        };

        const updatedPerson = { ...mockPerson, ...updatePersonInput };

        mockDatabaseService.query
          .mockResolvedValueOnce([{ affectedRows: 1 }])
          .mockResolvedValueOnce([[updatedPerson]]);

        const result = await service.update(1, updatePersonInput);
        expect(result).toEqual(updatedPerson);
        expect(mockDatabaseService.query).toHaveBeenCalledTimes(2);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'UPDATE person SET lastName = ?, firstName = ?, email = ?, phoneNumber = ? WHERE id = ?',
          ['Doe Updated', 'John', 'john.updated@example.com', '9999999999', 1],
        );
      });
    });

    describe('remove', () => {
      it('should remove and return the removed person', async () => {
        mockDatabaseService.query
          .mockResolvedValueOnce([[mockPerson]])
          .mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await service.remove(1);
        expect(result).toEqual(mockPerson);
        expect(mockDatabaseService.query).toHaveBeenCalledTimes(2);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'DELETE FROM person WHERE id = ?',
          [1],
        );
      });
    });
  });

  describe('Relations', () => {
    describe('getAnimals', () => {
      it('should return all animals owned by a person', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([mockAnimals]);

        const result = await service.getAnimals(1);
        expect(result).toEqual(mockAnimals);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
          'SELECT * FROM animal WHERE ownerId = ?',
          [1],
        );
      });

      it('should return empty array when person has no animals', async () => {
        mockDatabaseService.query.mockResolvedValueOnce([[]]);

        const result = await service.getAnimals(1);
        expect(result).toEqual([]);
      });
    });
  });
});
