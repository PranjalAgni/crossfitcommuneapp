import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItemProps {
  title: string;
  onPress: () => void;
}

function MenuItem({ title, onPress }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-3 flex-row items-center justify-between"
    >
      <Text className="text-white text-base font-medium">{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();

  // Get user's name from profile or fallback to email
  const getUserName = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName;
    }
    // Fallback: capitalize email username part
    if (user?.email) {
      const emailPart = user.email.split('@')[0];
      return emailPart
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
    return 'User';
  };

  // Get user's email from profile or Supabase user
  const getUserEmail = () => {
    return userProfile?.email || user?.email || '';
  };

  // Get initials for profile picture
  const getInitials = () => {
    const name = getUserName();
    return name
      .split(' ')
      .map((n: string) => n[0] as string)
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login screen after successful logout
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="flex-1 px-6 pt-6">
          {/* Profile Picture and User Info */}
          <View className="items-center mb-8">
            {/* Profile Picture Placeholder */}
            <View className="w-24 h-24 bg-gray-800 rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">{getInitials()}</Text>
            </View>

            {/* User Name */}
            <Text className="text-white text-2xl font-bold mb-1 text-center">
              {getUserName()}
            </Text>

            {/* User Email */}
            <Text className="text-gray-400 text-base text-center">{getUserEmail()}</Text>
          </View>

          {/* Menu Items */}
          <View className="mb-4">
            <MenuItem title="Account" onPress={() => console.log('Account pressed')} />
            <MenuItem title="Records" onPress={() => console.log('Records pressed')} />
          </View>

          <View className="mb-4">
            <MenuItem title="Help Center" onPress={() => console.log('Help Center pressed')} />
            <MenuItem title="Privacy Policy" onPress={() => console.log('Privacy Policy pressed')} />
            <MenuItem title="Terms of Service" onPress={() => console.log('Terms of Service pressed')} />
          </View>

          {/* Log Out Button */}
          <Pressable
            onPress={handleLogout}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mt-4 items-center"
          >
            <Text className="text-red-500 text-base font-medium">Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

