import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from "mongoose"
import { AppModule} from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';


describe('POST /auth/register', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;

  const validPayload = {
    username: 'testman',
    email: 'testman@test.com',
    password: 'password'
  }

  const successMessage = {message: "User created successfully"}

  beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
      }).compile();
  
      app = moduleRef.createNestApplication();
      await app.init();
      dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
      httpServer = app.getHttpServer();
    })

  afterAll(async () => {
      await app.close();
  })

  afterEach(async () => {
      await dbConnection.collection('users').deleteMany({});
  })

  it('POST /auth/register returns success with unique username, password, and email', () => {

    return request(httpServer)
      .post('/auth/register')
      .send(validPayload)
      .expect(201)
      .expect(successMessage)
  });

  it('POST /auth/register returns error if email is already registered', async () => {

    const validPayload2 = {
      username: 'testman2',
      email: 'testman@test.com',
      password: 'testpass'
    }

    await request(httpServer)
      .post('/auth/register')
      .send(validPayload)
      .expect(201)
      .expect(successMessage)

    // second submission returns error because email is already registered now
    return request(httpServer)
    .post('/auth/register')
    .send(validPayload2)
    .expect(409)
  });

  it('POST /auth/register returns error if password is too short (must be 8 chars or longer)', () => {
    const invalidPayload = {
      username: 'testman',
      email: 'testman@test.com',
      password: 'testpas'
    }

    return request(httpServer)
      .post('/auth/register')
      .send(invalidPayload)
      .expect(400)
  });

  it('POST /auth/register returns error if username is already in use', async () => {
    
    const validPayload2 = {
      username: 'testman',
      email: 'testman2@test.com',
      password: 'testpass'
    }

    const successMessage = {message: "User created successfully"}

    await request(httpServer)
      .post('/auth/register')
      .send(validPayload)
      .expect(201)
      .expect(successMessage)

    // second submission returns error because username is already registered now
    return request(httpServer)
    .post('/auth/register')
    .send(validPayload2)
    .expect(409)
  });
});