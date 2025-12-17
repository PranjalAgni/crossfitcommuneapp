import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      // Login successful - navigation will be handled by AuthContext
    } catch (error: any) {
      setIsLoading(false);
      // Handle specific Supabase error messages
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email before logging in');
        } else {
          setError(error.message || 'Login failed. Please try again.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    }
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
            <Text className="text-4xl font-bold text-white mb-2">Crossfit Commune</Text>
          </View>

          {/* Login Form */}
          <View className="mb-6">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Email
              </Text>
              <View className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4">
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  placeholder="Enter email"
                  placeholderTextColor="#6B7280"
                  className="text-white text-base"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
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

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

