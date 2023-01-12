import { Controller, UseGuards, Get, Request} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostService } from '../post/post.service';

@Controller('feed')
export class FeedController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async create(@Request() req) {
        return await this.postService.findAll(req.user);
    }
}
