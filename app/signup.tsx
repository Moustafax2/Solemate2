import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/components/auth/AuthContext';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement actual signup
      await login(email, password); // For now, just login
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />
      <StatusBar style="dark" />

      <ThemedView style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/SolemateLOGO_RED.png')} 
            style={styles.logo}
            resizeMode="contain"
            tintColor="rgb(227, 41, 36)"
          />
          <ThemedText type="title" style={styles.brandText}>SoleMate</ThemedText>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <ThemedText style={styles.loginLink}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 80,
  },
  brandText: {
    color: 'rgb(227, 41, 36)',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  form: {
    gap: 15,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: 'rgb(227, 41, 36)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    opacity: 0.7,
  },
  loginLink: {
    fontSize: 14,
    color: 'rgb(227, 41, 36)',
    fontWeight: '600',
  },
}); 