import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../post/schemas/post.schema';
import { PostService } from '../post/post.service';

@Module({
  providers: [PostService],
  controllers: [FeedController],
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],

})
export class FeedModule {}
