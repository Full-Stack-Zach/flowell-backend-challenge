import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private readonly model: Model<UserDocument>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        return await new this.model({
        ...createUserDto,
        createdAt: new Date(),
        }).save();
    }

    async findByEmail(email: string): Promise<UserDocument | undefined> {
        return await this.model.findOne({email: email}).exec();
    }

    async findByUsername(username: string): Promise<UserDocument | undefined> {
        return await this.model.findOne({username: username}).exec();
    }

    async deleteByEmail(email: string): Promise<any> {
        return await this.model.deleteOne({email: email}).exec();
    }
}
