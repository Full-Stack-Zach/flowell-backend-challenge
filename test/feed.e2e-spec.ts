import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule} from '../src/app.module';
import { Connection } from "mongoose"
import { DatabaseService } from '../src/database/database.service';
import { HashService } from '../src/auth/hash.service';


describe('GET /feed', () => {
    let app: INestApplication;
    let dbConnection: Connection;
    let httpServer: any;

    let token = "Bearer "
    const password = 'password'
    
    const validPayload = {
      username: 'testman',
      email: 'testman@test.com',
      password: ''
    }

    const validLoginPayload = {
        username: 'testman',
        email: 'testman@test.com',
        password: password
    }

    const validPostPayload1 = {
        title: "Test Post Title1",
        text: "This is the text for the post."
    }

    const validPostPayload2 = {
        title: "Test Post Title2",
        text: "This is the text for the post."
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
    
        app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
        httpServer = app.getHttpServer();

        const hashedPassword = await moduleRef.get<HashService>(HashService).hashPassword(password)
        validPayload.password = hashedPassword

        await dbConnection.collection('users').insertOne(validPayload)

        await request(httpServer)
        .post('/auth/login')
        .send(validLoginPayload)
        .expect(201)
        .expect(function(res){
          if (!res.body.hasOwnProperty('token')) throw new Error("Expected 'token' key!");
          token = token + res.body.token
        })

        await request(httpServer)
        .post('/posts')
        .set({ Authorization: token })
        .send(validPostPayload1)
        .expect(201)

        await request(httpServer)
        .post('/posts')
        .set({ Authorization: token })
        .send(validPostPayload2)
        .expect(201)
    })

    afterAll(async () => {
        await dbConnection.collection('posts').deleteMany({});
        await dbConnection.collection('users').deleteMany({});
        await app.close();
    })
  
    it('GET /feed returns success when user has valid JWT', async () => {
      
        const response = await request(httpServer).get('/feed').set({ Authorization: token })

        expect(response.status).toBe(200)
        expect(response.body[0]).toMatchObject(validPostPayload1)
        expect(response.body[1]).toMatchObject(validPostPayload2)
    });

    it('GET /feed returns 401 error when user has invalid JWT', async () => {

        const invalidToken = '1234567sdgfdgdfg234324'
      
        const response = await request(httpServer).get('/feed').set({ Authorization: invalidToken })

        expect(response.status).toBe(401)
    });
});