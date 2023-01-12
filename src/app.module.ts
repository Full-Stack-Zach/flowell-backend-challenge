import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FeedModule } from './feed/feed.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://zholub:FlowellTe$tDB47@cluster0.3jhbugb.mongodb.net/test'), PostModule, AuthModule, UsersModule, FeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
