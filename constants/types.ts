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

export interface Program {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  patchNumber: number;
  forGroups: boolean;
  acceptApplicationDuration: Date;
  referenceCode: null;
  accentColor: string;
  description: string;
  vision: string;
  mission: string;
  more: string;
  achieve: string;
  Image: Logo[];
  logo: Logo;
}

export interface Logo {
  path: string;
}
