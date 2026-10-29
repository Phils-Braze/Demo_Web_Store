export type UserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  favoriteProductCategory: string;
  isDarkModeEnabled: boolean;
  paidMembership: boolean;
  customEvents: string[];
};

export function emptyProfile(userId: string): UserProfile {
  return {
    userId,
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    favoriteProductCategory: "",
    isDarkModeEnabled: false,
    paidMembership: false,
    customEvents: [],
  };
}
