import { Comment } from "./comment";
import { Like } from "./like";
import { User } from "./user";

export class Post {
    comments?: Comment[]
    content?: string;
    createdDate?: string;
    id?: string;
    imagePath?: string;
    likes?: Like[]
    title?: string;
    userId?: User;
    canLike?: boolean
}