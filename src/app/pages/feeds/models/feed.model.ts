import { User } from "src/app/core/models";
import { Like } from "src/app/core/models/like";

export class Feed {
    comments: Comment[];
    content: string;
    createdDate?: string;
    id?: string;
    imagePath?: string;
    likes?: Like[];
    title?: string;
    userId?: User;
    canLike?: boolean;
    constructor(
        comments?: Comment[],
        content?: string,
        createdDate?: string,
        id?: string,
        imagePath?: string,
        likes?: Like[],
        title?: string,
        userId?: User,
        canLike?: boolean,
    ) {
        this.comments = comments;
        this.content = content;
        this.createdDate = createdDate;
        this.id = id;
        this.imagePath = imagePath;
        this.likes = likes;
        this.title = title;
        this.userId = userId;
        this.canLike = canLike;
    }
}