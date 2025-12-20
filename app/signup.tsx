import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(email.trim(), password, fullName.trim());
      // Signup successful - navigation will be handled by AuthContext
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      // Handle specific Supabase error messages
      if (error.message) {
        const errorMessage = error.message.toLowerCase();
        
        // Database/server errors
        if (errorMessage.includes('database') || 
            errorMessage.includes('db error') ||
            errorMessage.includes('internal server error') ||
            errorMessage.includes('500') ||
            errorMessage.includes('network') ||
            errorMessage.includes('connection')) {
          setError('Cannot signup right now. Please contact admin or try again later.');
        }
        // User already exists
        else if (errorMessage.includes('user already registered') || 
                 errorMessage.includes('already registered') ||
                 errorMessage.includes('email already')) {
          setError('An account with this email already exists. Please sign in instead.');
        }
        // Password requirements
        else if (errorMessage.includes('password')) {
          setError('Password does not meet requirements. Please use a stronger password.');
        }
        // Email validation
        else if (errorMessage.includes('email') || errorMessage.includes('invalid')) {
          setError('Please enter a valid email address');
        }
        // Email confirmation
        else if (errorMessage.includes('check your email') || 
                 errorMessage.includes('email confirmation')) {
          setError('Please check your email to confirm your account before signing in.');
        }
        // Rate limiting
        else if (errorMessage.includes('rate limit') || 
                 errorMessage.includes('too many requests')) {
          setError('Too many signup attempts. Please try again in a few minutes.');
        }
        // Generic fallback
        else {
          setError('Cannot signup right now. Please contact admin or try again later.');
        }
      } else {
        setError('Cannot signup right now. Please contact admin or try again later.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-6">
            {/* Logo/Title Section */}
            <View className="items-center mb-10">
              <Text className="text-4xl font-bold text-white mb-2">Crossfit Commune</Text>
              <Text className="text-gray-400 text-base">Create your account</Text>
            </View>

            {/* Signup Form */}
            <View className="mb-6">
              {/* Full Name Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                  Full Name
                </Text>
                <View className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4">
                  <TextInput
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      setError('');
                    }}
                    placeholder="Enter your full name"
                    placeholderTextColor="#6B7280"
                    className="text-white text-base"
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="name"
                  />
                </View>
              </View>

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
              <View className="mb-4">
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
                    style={{ color: '#FFFFFF', flex: 1, fontSize: 16 }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
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

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                  Confirm Password
                </Text>
                <View className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex-row items-center">
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                    placeholder="Confirm password"
                    placeholderTextColor="#6B7280"
                    style={{ color: '#FFFFFF', flex: 1, fontSize: 16 }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSignup}
                    returnKeyType="done"
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2"
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
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

              {/* Signup Button */}
              <Pressable
                onPress={handleSignup}
                disabled={isLoading}
                className={`bg-[#D4AF37] rounded-xl py-4 items-center ${
                  isLoading ? 'opacity-50' : ''
                }`}
              >
                <Text className="text-base font-bold text-black">
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Text>
              </Pressable>
            </View>

            {/* Sign In Link */}
            <View className="items-center mt-6">
              <Text className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Text 
                  className="text-[#D4AF37] font-semibold"
                  onPress={() => router.replace('/login')}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

