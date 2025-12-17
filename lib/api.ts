import { UserProfile } from '@/types/user';
import Constants from 'expo-constants';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

if (!apiBaseUrl) {
  console.warn('API_BASE_URL is not set in environment variables');
}

/**
 * Fetches the current user's profile from the /me endpoint
 * @param accessToken - Supabase access token
 * @returns UserProfile object
 */
export async function fetchUserProfile(accessToken: string): Promise<UserProfile> {
  if (!apiBaseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  const response = await fetch(`${apiBaseUrl}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch user profile: ${response.status} ${errorText}`);
  }

  const data: UserProfile = await response.json();
  return data;
}

