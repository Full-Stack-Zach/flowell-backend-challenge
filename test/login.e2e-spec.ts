import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule} from '../src/app.module';
import { Connection } from "mongoose"
import { DatabaseService } from "../src/database/database.service";
import { HashService } from '../src/auth/hash.service';

describe('POST /auth/login', () => {
    let app: INestApplication;
    let dbConnection: Connection;
    let httpServer: any;

    const password = 'password'
  
    const validPayload = {
      username: 'testman',
      email: 'testman@test.com',
      password: ''
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule]
        }).compile();

        const hashedPassword = await moduleRef.get<HashService>(HashService).hashPassword(password)
        validPayload.password = hashedPassword
    
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
  
    it('POST /auth/login returns success with correct email and password', async () => {

      const loginPayload = {
        email: validPayload.email,
        password: password
      }

      await dbConnection.collection('users').insertOne(validPayload)
  
      return request(httpServer)
        .post('/auth/login')
        .send(loginPayload)
        .expect(201)
        .expect(function(res){
          if (!res.body.hasOwnProperty('token')) throw new Error("Expected 'token' key!");
        })
  
    });
  
    it('POST /auth/login returns error if email is not found', async () => {
  
      const loginPayload = {
        email: "unique@email.com",
        password: validPayload.password
      }
  
      return request(httpServer)
        .post('/auth/login')
        .send(loginPayload)
        .expect(401)
    });
  
    it('POST /auth/login returns error if password is incorrect', async () => {
  
      const loginPayload = {
        email: validPayload.email,
        password: "wrong-password"
      }
  
      request(httpServer)
      .post('/auth/register')
      .send(validPayload)
      .expect(201)
  
      return request(httpServer)
        .post('/auth/login')
        .send(loginPayload)
        .expect(401)
    });
  });