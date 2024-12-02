import { Test, TestingModule } from '@nestjs/testing';
import { PersonResolver } from './person.resolver';
import { PersonService } from './person.service';
import { DatabaseService } from '../config/database.service';
import { ConfigService } from '@nestjs/config';

describe('PersonResolver', () => {
  let resolver: PersonResolver;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonResolver,
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

    resolver = module.get<PersonResolver>(PersonResolver);
    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
