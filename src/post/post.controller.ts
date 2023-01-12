import {
    Body,
    Request,
    Controller,
    Delete,
    Param,
    Post,
    UseGuards
  } from '@nestjs/common';
  import { CreatePostDto } from './dto/create-post.dto';
  import { PostService } from './post.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() createPostDto: CreatePostDto) {
        return await this.postService.create(createPostDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Request() req, @Param('id') id: string) {
        return await this.postService.delete(id, req.user);
    }
}
