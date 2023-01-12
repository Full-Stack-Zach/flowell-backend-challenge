import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { UserAuthPayload } from '../auth/auth.types';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private readonly model: Model<PostDocument>
    ) {}

    async findAll(user: UserAuthPayload): Promise<Post[]> {
        return await this.model.find({id: user.userId}).exec();
    }

    async findOne(id: string): Promise<Post> {
        const checkForValidMongooseId = /^[a-f\d]{24}$/i

        if (!checkForValidMongooseId.test(id)){
            throw new BadRequestException
        }

        try {
        
            return await this.model.findById(id).exec();
        } catch(err){
            console.log(err)
            throw new InternalServerErrorException
        }
    }


    async create(createPostDto: CreatePostDto, user: UserAuthPayload): Promise<Post> {

        try {
            return await new this.model({
                ...createPostDto,
                createdByUser: user.userId,
                createdAt: new Date(),
                }).save();
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException
        }
    }

    async delete(id: string, user: UserAuthPayload): Promise<Post> {

        const post = await this.findOne(id)

        if (!post){
            throw new NotFoundException
        }

        if (post.createdByUser !== user.userId){
            console.log('po')
            throw new UnauthorizedException
        }

        try {
            return await this.model.findByIdAndDelete(id).exec();
        } catch (err){
            console.log(err)
            throw new InternalServerErrorException
        }
    }
}
