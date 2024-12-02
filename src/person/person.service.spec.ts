import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { DatabaseService } from '../config/database.service';
import { ConfigService } from '@nestjs/config';

describe('PersonService', () => {
  let service: PersonService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dbService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: DatabaseService,
          useValue: {
            query: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
