import { BasePostDto } from "./base-post.dto";

export class CreatePostDto extends BasePostDto {
    createdByUser: string
    createdAt: Date
}