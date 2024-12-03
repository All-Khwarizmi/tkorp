import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Animal Queries', () => {
    it('should query animals with pagination', () => {
      const query = `
        query {
          animals(page: 1, take: 10) {
            items {
              id
              name
              species
              breed
              owner {
                id
                firstName
                lastName
              }
            }
            total
            hasMore
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.animals).toBeDefined();
          expect(Array.isArray(res.body.data.animals.items)).toBeTruthy();
          expect(typeof res.body.data.animals.total).toBe('number');
          expect(typeof res.body.data.animals.hasMore).toBe('boolean');
        });
    });

    it('should query animal statistics', () => {
      const query = `
        query {
          mostCommonSpecies {
            species
            count
          }
          oldestAnimal {
            id
            name
            dateOfBirth
          }
          heaviestAnimal {
            id
            name
            weight
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data.mostCommonSpecies)).toBeTruthy();
          expect(res.body.data.oldestAnimal).toBeDefined();
          expect(res.body.data.heaviestAnimal).toBeDefined();
        });
    });
  });

  describe('Person Queries', () => {
    it('should query persons with pagination', () => {
      const query = `
        query {
          persons(page: 1, take: 10) {
            items {
              id
              firstName
              lastName
              email
              animals {
                id
                name
                species
              }
            }
            total
            hasMore
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.persons).toBeDefined();
          expect(Array.isArray(res.body.data.persons.items)).toBeTruthy();
          expect(typeof res.body.data.persons.total).toBe('number');
          expect(typeof res.body.data.persons.hasMore).toBe('boolean');
        });
    });
  });

  describe('Mutations', () => {
    it('should create a new person', () => {
      const mutation = `
        mutation {
          createPerson(createPersonInput: {
            firstName: "John"
            lastName: "Doe"
            email: "john.doe@example.com"
            phoneNumber: "1234567890"
          }) {
            id
            firstName
            lastName
            email
            phoneNumber
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createPerson).toBeDefined();
          expect(res.body.data.createPerson.firstName).toBe('John');
          expect(res.body.data.createPerson.lastName).toBe('Doe');
          expect(res.body.data.createPerson.email).toBe('john.doe@example.com');
        });
    });

    it('should create a new animal', () => {
      const mutation = `
        mutation {
          createAnimal(createAnimalInput: {
            name: "Rex"
            species: "Dog"
            breed: "German Shepherd"
            dateOfBirth: "2020-01-01"
            color: "Brown"
            weight: 30
            ownerId: 1
          }) {
            id
            name
            species
            breed
            owner {
              id
              firstName
              lastName
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAnimal).toBeDefined();
          expect(res.body.data.createAnimal.name).toBe('Rex');
          expect(res.body.data.createAnimal.species).toBe('Dog');
          expect(res.body.data.createAnimal.breed).toBe('German Shepherd');
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid queries gracefully', () => {
      const invalidQuery = `
        query {
          invalidField {
            id
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: invalidQuery })
        .expect(400)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(Array.isArray(res.body.errors)).toBeTruthy();
        });
    });

    it('should handle validation errors in mutations', () => {
      const invalidMutation = `
        mutation {
          createPerson(createPersonInput: {
            firstName: ""
            lastName: ""
            email: "invalid-email"
            phoneNumber: ""
          }) {
            id
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: invalidMutation })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(Array.isArray(res.body.errors)).toBeTruthy();
        });
    });
  });
});
