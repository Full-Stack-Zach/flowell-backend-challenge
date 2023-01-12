import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    createdByUser: string;

    @Prop({ required: true })
    createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);