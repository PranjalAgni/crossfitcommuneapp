export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  accountStatus: string;
  firstLoginAt: string | null;
  lastLoginAt: string | null;
  onboardingCompletedAt: string | null;
  units: string;
}

