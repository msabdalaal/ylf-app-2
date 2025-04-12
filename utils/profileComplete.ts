import { User } from "@/constants/types";

export const isProfileComplete = (user: User) => {
  // Create an object to track missing fields
  const missingFields: Record<string, boolean> = {};

  // Check each required field
  if (!user?.phoneNumber) missingFields.phoneNumber = true;
  if (!user?.dateOfBirth) missingFields.dateOfBirth = true;
  if (!user?.college) missingFields.college = true;
  if (!user?.university) missingFields.university = true;
  if (!user?.jobTitle) missingFields.jobTitle = true;
  if (!user?.age) missingFields.age = true;
  if (!user?.address) missingFields.address = true;
  if (!user?.languages?.[0]) missingFields.languages = true;
  if (!user?.skills?.[0]) missingFields.skills = true;
  if (!user?.idFront?.path) missingFields.idFront = true;
  if (!user?.idBack?.path) missingFields.idBack = true;

  // Log missing fields if any
  if (Object.keys(missingFields).length > 0) {
    console.log("Profile incomplete. Missing fields:", missingFields);
  } else {
    console.log("Profile is complete!");
  }

  // Return the original check
  return !!(
    user?.phoneNumber &&
    user?.dateOfBirth &&
    user?.college &&
    user?.university &&
    user?.jobTitle &&
    user?.age &&
    user?.address &&
    user?.languages?.[0] &&
    user?.skills?.[0] &&
    user?.idFront?.path &&
    user?.idBack?.path
  );
};
