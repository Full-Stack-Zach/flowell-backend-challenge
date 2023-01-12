
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule} from '../src/app.module';
import { Connection } from "mongoose"
import { DatabaseService } from '../src/database/database.service';
import { HashService } from '../src/auth/hash.service';

describe('POST /posts', () => {
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

    const validPostPayload = {
        title: "Test Post Title",
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
    })

    afterAll(async () => {
        await dbConnection.collection('users').deleteMany({});
        await app.close();
    })

    afterEach(async () => {
        await dbConnection.collection('posts').deleteMany({});
    })
  
    it('POST /posts returns success when user has valid JWT and valid payload', async () => {
      
      return request(httpServer)
        .post('/posts')
        .set({ Authorization: token })
        .send(validPostPayload)
        .expect(201)
    });

    it('POST /posts returns error if payload does not include valid JWT', async () => {
      const fakeToken = "Bearer 12345dfgsdgfdsq3432433433"
    
      return request(httpServer)
        .post('/posts')
        .set({ Authorization: fakeToken })
        .send(validPostPayload)
        .expect(401)
    });


    it('POST /posts returns error if payload does not include title field', async () => {

      const invalidPostPayload = {
        text: "This is the text for the post."
      }

      return request(httpServer)
        .post('/posts')
        .set({ Authorization: token })
        .send(invalidPostPayload)
        .expect(400)
    });

    it('POST /posts returns error if payload does not include text field', async () => {

      const invalidPostPayload = {
        title: "This is the Title for the post."
      }

      return request(httpServer)
        .post('/posts')
        .set({ Authorization: token })
        .send(invalidPostPayload)
        .expect(400)
    });
  });



  describe('DELETE /posts/:id', () => {
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

    const validPostPayload = {
        title: "Test Post Title",
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
    })

    afterAll(async () => {
        await dbConnection.collection('users').deleteMany({});
        await app.close();
    })

    afterEach(async () => {
        await dbConnection.collection('posts').deleteMany({});
    })
  
    it('DELETE /posts/:id returns success when user has valid JWT and valid post ID', async () => {

      let postId = ''

      await request(httpServer)
        .post('/posts')
        .set({ Authorization: token })
        .send(validPostPayload)
        .expect(201)
        .expect(function(res){
          if (!res.body.hasOwnProperty('_id')) throw new Error("Expected '_id' key!");
          postId = res.body._id
        })
      
      return request(httpServer)
        .delete(`/posts/${postId}`)
        .set({ Authorization: token })
        .expect(200)
    });

    it('DELETE /posts/:id returns 404 error when post ID is invalid', async () => {

      let invalidPostId = '63c08ca9630e68227b299863'

      await request(httpServer)
        .post('/posts')
        .set({ Authorization: token })
        .send(validPostPayload)
        .expect(201)
      
      return request(httpServer)
        .delete(`/posts/${invalidPostId}`)
        .set({ Authorization: token })
        .expect(404)
    });

    it('DELETE /posts/:id returns 401 error when user tries to delete a post that does not belong to them', async () => {
      let token2 = "Bearer "
      let postId = ''

      const validPayload2 = {
        username: 'testman2',
        email: 'testman2@test.com',
        password: 'testpass'
      }

      const loginPayload2 = {
        email: validPayload2.email,
        password: validPayload2.password
      }
  
      await request(httpServer)
        .post('/auth/register')
        .send(validPayload2)
        .expect(201)
        
      await request(httpServer)
        .post('/auth/login')
        .send(loginPayload2)
        .expect(201)
        .expect(function(res){
          if (!res.body.hasOwnProperty('token')) throw new Error("Expected 'token' key!");
          token2 = token2 + res.body.token
        })

      await request(httpServer)
        .post('/posts')
        .set({ Authorization: token })
        .send(validPostPayload)
        .expect(201)
        .expect(function(res){
          if (!res.body.hasOwnProperty('_id')) throw new Error("Expected '_id' key!");
          postId = res.body._id
        })
      
      return request(httpServer)
        .delete(`/posts/${postId}`)
        .set({ Authorization: token2 })
        .expect(401)
    });
  });