import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Email } from '../src/emails/entities/email.entity';
import * as request from 'supertest';
import { getConnection, Repository } from 'typeorm';
import { AppModule } from '../src/app.module';

const clear = async () => {
  const connection = getConnection();
  const entities = connection.entityMetadatas;

  entities.forEach(async (entity) => {
    const repository = connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  });
};

const mockData = { email: 'any@email.com', name: 'any' };

describe('EmailResolver (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Email>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [{ provide: getRepositoryToken(Email), useClass: Repository }],
    }).compile();

    app = module.createNestApplication();
    repository = module.get(getRepositoryToken(Email));
    await app.init();
    await clear();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('query emails', () => {
    it('should return empty array if database is empty', async () => {
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: 'query{emails{name, email}}',
        })
        .expect(200);
      expect(result.body.data.emails).toStrictEqual([]);
    });

    it('should return array with emails in database', async () => {
      await repository.save({ ...mockData });
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: 'query{emails{name, email}}',
        })
        .expect(200);
      expect(result.body.data.emails).toHaveLength(1);
      expect(result.body.data.emails[0]).toStrictEqual(mockData);
    });
  });

  describe('query email', () => {
    it('should return email in database', async () => {
      await repository.save({ ...mockData });
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query{email(email:"${mockData.email}"){name, email}}`,
        })
        .expect(200);
      expect(result.body.data.email).toStrictEqual(mockData);
    });
  });

  describe('mutation createEmail', () => {
    it('should return email in database', async () => {
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{createEmail(createEmailInput:{email:"${mockData.email}",name:"${mockData.name}"}){name, email}}`,
        })
        .expect(200);

      const data = await repository.find();

      expect(data).toHaveLength(1);
      expect({ ...data[0], id: 'any' }).toStrictEqual({
        ...mockData,
        id: 'any',
      });
      expect(result.body.data.createEmail).toStrictEqual(mockData);
    });

    it('should return 400 if called with invalid params', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{createEmail(createEmailInput:{email:"INVALID"}){name, email}}`,
        })
        .expect(400);
    });
  });

  describe('mutation updateEmail', () => {
    it('should update email in database and return it', async () => {
      const mockUpdatedData = { ...mockData, name: 'updated name' };
      await repository.save({ ...mockData });
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{updateEmail(updateEmailInput:{email:"${mockData.email}",name:"${mockUpdatedData.name}"}){name, email}}`,
        })
        .expect(200);

      const data = await repository.find();

      expect({ ...data[0], id: 'any' }).toStrictEqual({
        ...mockUpdatedData,
        id: 'any',
      });
      expect(result.body.data.updateEmail).toStrictEqual(mockUpdatedData);
    });

    it('should return 400 if called with invalid params', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{updateEmail(updateEmailInput:{email:"INVALID"}){name, email}}`,
        })
        .expect(400);
    });
  });

  describe('mutation removeEmail', () => {
    it('should delete email in database', async () => {
      await repository.save({ ...mockData });
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{removeEmail(email:"${mockData.email}"){name, email}}`,
        })
        .expect(200);

      const data = await repository.find();

      expect(data).toHaveLength(0);
      expect(result.body.data.removeEmail).toStrictEqual(mockData);
      console.log(process.env.CI);
    });
  });
});
