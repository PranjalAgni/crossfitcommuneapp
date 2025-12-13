import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials
  const MOCK_USERNAME = 'user';
  const MOCK_PASSWORD = 'password';

  const handleLogin = () => {
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(async () => {
      if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
        try {
          await login();
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setError('Login failed. Please try again.');
        }
      } else {
        setIsLoading(false);
        setError('Invalid username or password');
      }
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo/Title Section */}
          <View className="items-center mb-12">
            <Text className="text-5xl font-bold text-white mb-2">HWPO</Text>
            <Text className="text-lg text-gray-400 uppercase tracking-wider">Training</Text>
          </View>

          {/* Login Form */}
          <View className="mb-6">
            {/* Username Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Username
              </Text>
              <View className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4">
                <TextInput
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    setError('');
                  }}
                  placeholder="Enter username"
                  placeholderTextColor="#6B7280"
                  className="text-white text-base"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Password
              </Text>
              <View className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  placeholder="Enter password"
                  placeholderTextColor="#6B7280"
                  className="text-white text-base flex-1"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={handleLogin}
                  returnKeyType="done"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9CA3AF"
                  />
                </Pressable>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="mb-4 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
                <Text className="text-red-400 text-sm">{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className={`bg-[#D4AF37] rounded-xl py-4 items-center ${
                isLoading ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-base font-bold text-black">
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </Pressable>
          </View>

          {/* Mock Credentials Hint */}
          <View className="mt-8 items-center">
            <Text className="text-xs text-gray-600 text-center">
              Demo Credentials:{'\n'}
              Username: <Text className="text-gray-400">user</Text>{'\n'}
              Password: <Text className="text-gray-400">password</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

