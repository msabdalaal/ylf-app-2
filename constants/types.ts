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
  image: any;
}
