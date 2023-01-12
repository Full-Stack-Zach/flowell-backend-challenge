
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule} from '../src/app.module';

describe('POST /auth/login', () => {
    let app: INestApplication;
  
    const validPayload = {
      username: 'testman',
      email: 'testman@test.com',
      password: 'testpass'
    }
  
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
  
    it('POST /auth/login returns success with correct email and password', () => {
  
      const loginPayload = {
        email: validPayload.email,
        password: validPayload.password
      }
  
      request(app.getHttpServer())
      .post('/auth/register')
      .send(validPayload)
      .expect(201)
  
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginPayload)
        .expect(201)
        .expect(function(res){
          if (!res.body.hasOwnProperty('token')) throw new Error("Expected 'token' key!");
        })
  
    });
  
    it('POST /auth/login returns error if email is not found', () => {
  
      const loginPayload = {
        email: "unique@email.com",
        password: validPayload.password
      }
  
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginPayload)
        .expect(401)
    });
  
    it('POST /auth/login returns error if password is incorrect', () => {
  
      const loginPayload = {
        email: validPayload.email,
        password: "wrong-password"
      }
  
      request(app.getHttpServer())
      .post('/auth/register')
      .send(validPayload)
      .expect(201)
  
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginPayload)
        .expect(401)
    });
  });