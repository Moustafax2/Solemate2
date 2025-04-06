import React, { useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CameraComponent from '@/components/camera/CameraComponent';
import { useShoe } from '@/components/shoe/ShoeContext';
import { useCommunityFinds } from '@/components/shoe/CommunityFindsContext';
import { useAuth } from '@/components/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ShoeScanner() {
  const { captureImage, isLoading, error, shoeData, imageUri } = useShoe();
  const { addCommunityFind } = useCommunityFinds();
  const { user } = useAuth();
  const router = useRouter();
  const addedToCommunityRef = useRef(false);

  const handleImageCaptured = async (imageUri: string) => {
    await captureImage(imageUri);
  };

  // Add to community finds when shoe is successfully identified
  React.useEffect(() => {
    if (shoeData && imageUri && user && !addedToCommunityRef.current) {
      addCommunityFind(
        shoeData, 
        imageUri, 
        user.username || 'anonymous', 
        user.username || 'Anonymous User'
      );
      addedToCommunityRef.current = true;
    }
  }, [shoeData, imageUri, user, addCommunityFind]);

  // Reset the flag when the component unmounts or when a new image is captured
  React.useEffect(() => {
    return () => {
      addedToCommunityRef.current = false;
    };
  }, []);

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
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(229, 57, 53, 0.9)',
    padding: 15,
    borderRadius: 10,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
}); 