// Validation utility functions

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validatePhoneNumber = (phone: string): string | null => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phone) return "Phone number is required";
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) return "Please enter a valid phone number";
  return null;
};

export const validateAge = (age: string): string | null => {
  const ageNum = parseInt(age);
  if (!age) return "Age is required";
  if (isNaN(ageNum)) return "Age must be a number";
  if (ageNum < 10 || ageNum > 100) return "Age must be between 10 and 100";
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value) return `${fieldName} is required`;
  return null;
};

export const validateDateOfBirth = (date: Date | null): string | null => {
  if (!date) return "Date of birth is required";
  
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 100); // 100 years ago
  
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 10); // 16 years ago
  
  if (date > today) return "Date cannot be in the future";
  if (date < minDate) return "Please enter a valid date of birth";
  if (date > maxDate) return "You must be at least 10 years old";
  
  return null;
};

export const validateLanguage = (language: string[]): string | null => {
  if (!language.length) return "Language cannot be empty";
  return null;
};

export const validateSkill = (skill: string[]): string | null => {
  if (!skill.length) return "Skill cannot be empty";
  return null;
};