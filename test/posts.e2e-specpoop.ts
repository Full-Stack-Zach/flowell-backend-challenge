
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule} from '../src/app.module';

// describe('POST /posts', () => {
//     let app: INestApplication;
  
//     const validUserPayload = {
//       username: 'testman',
//       email: 'testman@test.com',
//       password: 'testpass'
//     }

//     const validLoginPayload = {
//       email: validUserPayload.email,
//       password: validUserPayload.password
//     }

//     const validPostPayload = {
//       title: 'test title',
//       text: 'test post text'
//     }
  
//     beforeEach(async () => {
//       const moduleFixture: TestingModule = await Test.createTestingModule({
//         imports: [AppModule],
//       }).compile();
  
//       app = moduleFixture.createNestApplication();
//       await app.init();
//     });
  
//     afterEach(done => {
//       app.close()
//       done()
//     })
  
//     it('POST /posts returns success when user has valid JWT and valid payload', () => {
//       let token = 'Bearer '
  
//       request(app.getHttpServer())
//       .post('/auth/register')
//       .send(validUserPayload)
//       .expect(201)

//       request(app.getHttpServer())
//       .post('/auth/login')
//       .send(validLoginPayload)
//       .expect(201)
//       .expect(function(res){
//         if (!res.body.hasOwnProperty('token')) throw new Error("Expected 'token' key!");
//         token = token + res.body.token
//       })
  
//       return request(app.getHttpServer())
//         .post('/posts')
//         .set({ Authorization: token })
//         .send(validPostPayload)
//         .expect(201)
//     });
//   });