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
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  jobTitle?: string;
  age?: string;
  address?: string;
  dateOfBirth?: string;
  experiences?: string[];
  languages?: string[];
  skills?: string[];
  education?: string[];
  groupId?: string;
  idFront?: string;
  idBack?: string;
  avatar?: { path: string };
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
  isRegistered?: boolean;
}

export interface Logo {
  path: string;
}

export interface Question {
  createdAt: string;
  id: string;
  programId: string;
  question: string;
  required: boolean;
  type: "complete" | "upload" | "rightWrong" | "mcq";
}
