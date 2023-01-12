import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule} from '../src/app.module';

describe('POST /auth/register', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(done => {
    app.close()
    done()
  })

  it('POST /auth/register returns success with unique username, password, and email', () => {
    const validPayload = {
      username: 'testman',
      email: 'testman@test.com',
      password: 'testpass'
    }
    const successMessage = {message: "User created successfully"}

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(validPayload)
      .expect(201)
      .expect(successMessage)
  });

  it('POST /auth/register returns error if email is already registered', () => {
    const validPayload1 = {
      username: 'testman',
      email: 'testman@test.com',
      password: 'testpass'
    }

    const validPayload2 = {
      username: 'testman2',
      email: 'testman@test.com',
      password: 'testpass'
    }

    const successMessage = {message: "User created successfully"}

    request(app.getHttpServer())
      .post('/auth/register')
      .send(validPayload1)
      .expect(201)
      .expect(successMessage)

    // second submission returns error because email is already registered now
    return request(app.getHttpServer())
    .post('/auth/register')
    .send(validPayload2)
    .expect(409)
  });

  it('POST /auth/register returns error if password is too short (must be 8 chars or longer)', () => {
    const validPayload = {
      username: 'testman',
      email: 'testman@test.com',
      password: 'testpas'
    }

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(validPayload)
      .expect(400)
  });

  it('POST /auth/register returns error if username is already in use', () => {
    const validPayload1 = {
      username: 'testman',
      email: 'testman1@test.com',
      password: 'testpass'
    }

    const validPayload2 = {
      username: 'testman',
      email: 'testman2@test.com',
      password: 'testpass'
    }

    const successMessage = {message: "User created successfully"}

    request(app.getHttpServer())
      .post('/auth/register')
      .send(validPayload1)
      .expect(201)
      .expect(successMessage)

    // second submission returns error because username is already registered now
    return request(app.getHttpServer())
    .post('/auth/register')
    .send(validPayload2)
    .expect(409)
  });
});