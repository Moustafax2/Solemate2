import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CameraComponent from '@/components/camera/CameraComponent';
import { useShoe } from '@/components/shoe/ShoeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ShoeScanner() {
  const { captureImage, isLoading, error } = useShoe();
  const router = useRouter();

  const handleImageCaptured = async (imageUri: string) => {
    await captureImage(imageUri);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Shoe Scanner',
          headerTransparent: true,
          headerTintColor: 'white',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#2196F3" />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar style="light" />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Analyzing your shoe...</Text>
        </View>
      ) : (
        <CameraComponent onImageCaptured={handleImageCaptured} />
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(200, 0, 0, 0.8)',
    padding: 15,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
  },
}); 