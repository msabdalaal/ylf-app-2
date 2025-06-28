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
  images: Image[];
  type: "event" | "program" | "normal";
  eventId?: string;
  isRegistered?: boolean;
  programId?: string;
}

export interface Event {
  id: string;
  name: string;
  programId: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

interface Image {
  path: string;
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
  experiences?: string;
  languages?: string[];
  skills?: string[];
  college?: string;
  university?: string;
  groupId?: string;
  programApplications?: ProgramApplication[];
  idFront?: { path: string };
  idBack?: { path: string };
  avatar?: { path: string };
  groupLeader?: {
    id: string;
    name: string;
    referenceCode: string;
  }[];
  groups: {
    id: string;
    name: string;
    program: Program;
  }[];
}
export interface ProgramApplication {
  id: string;
  programId: string;
  subscriberId: string;
  isAccepted: string;
  createdAt: Date;
  program: Program;
}

export interface Program {
  name: string;
  id: string;
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
  croppedImage?: Logo;
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

export interface Opportunity {
  id?: string;
  name: string;
  tags: string[];
  description: string;
  opportunitySpec: string[];
  isVisible: boolean;
}

export interface Notification {
  body: string;
  createdAt: Date;
  id: string;
  title: string;
  userId: string;
  read: boolean;
  link: string;
  programId: string;
}
