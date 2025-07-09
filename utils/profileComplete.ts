// utils/profileComplete.ts
import { User } from "@/constants/types";

export const isProfileComplete = (user: User) => {
  const missingFields: Record<string, boolean> = {};

  if (!user.avatar?.path) missingFields.avatar = true;
  if (!user.phoneNumber) missingFields.phoneNumber = true;
  if (!user.dateOfBirth) missingFields.dateOfBirth = true;
  if (!user.school) missingFields.school = true;
  if (!user.college && user.schoolType == "university")
    missingFields.college = true;
  if (!user.jobTitle) missingFields.jobTitle = true;
  if (!user.age) missingFields.age = true;
  if (!user.address) missingFields.address = true;
  if (!user.languages?.[0]) missingFields.languages = true;
  if (!user.skills?.[0]) missingFields.skills = true;
  if (!user.idFront?.path) missingFields.idFront = true;
  if (!user.idBack?.path) missingFields.idBack = true;

  if (Object.keys(missingFields).length > 0) {
    console.log("Profile incomplete. Missing fields:", missingFields);
  } else {
    console.log("Profile is complete!");
  }

  return Object.keys(missingFields).length === 0;
};
