import { Test, TestingModule } from '@nestjs/testing';
import { AnimalService } from './animal.service';
import { DatabaseService } from '../config/database.service';

const mockDatabaseService = {
  query: jest.fn(),
};

describe('AnimalService', () => {
  let service: AnimalService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dbService: DatabaseService;

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
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
