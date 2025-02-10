export interface Post {
  id: string;
  content: string;
  likeCounter: number;
  commentCounter: number;
  userId: string;
  createdAt: Date;
  likedUsers: any[];
  imageId: null;
  user: User;
  hasLiked: boolean;
}

export interface User {
  name: string;
  email: string;
  avatar: any;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  user: User;
  userId: string;
  createdAt: Date;
}
