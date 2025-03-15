import { User } from "@/constants/types";

export const isProfileComplete = (user: User) => {
  return !!(
    user?.phoneNumber &&
    user?.dateOfBirth &&
    user?.education?.[0] &&
    user?.experiences?.[0] &&
    user?.jobTitle &&
    user?.age &&
    user?.address &&
    user?.languages?.[0] &&
    user?.skills?.[0]
  );
};