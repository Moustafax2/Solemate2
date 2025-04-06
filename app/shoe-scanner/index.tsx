import React, { useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CameraComponent from '@/components/camera/CameraComponent';
import { useShoe } from '@/components/shoe/ShoeContext';
import { useRecentFinds } from '@/components/shoe/RecentFindsContext';
import { useAuth } from '@/components/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ShoeScanner() {
  const { captureImage, isLoading, error, shoeData, imageUri, resetShoeData } = useShoe();
  const { addRecentFind, recentFinds } = useRecentFinds();
  const { user } = useAuth();
  const router = useRouter();
  const addedToRecentRef = useRef(false);
  const currentImageUriRef = useRef<string | null>(null);
  const lastScannedShoeRef = useRef<string | null>(null);

  // Function to check if a shoe is already in recent finds
  const isDuplicateShoe = (shoeData: any) => {
    if (!shoeData) return false;
    
    // Create a unique identifier for the shoe
    const shoeIdentifier = `${shoeData.brand}-${shoeData.model}-${shoeData.price.usd}`;
    
    // Check if this exact shoe was just scanned (to prevent duplicates from multiple scans)
    if (lastScannedShoeRef.current === shoeIdentifier) {
      console.log('Preventing duplicate scan of the same shoe');
      return true;
    }
    
    // Check if this shoe is already in recent finds
    const isDuplicate = recentFinds.some(find => 
      find.shoeData.brand === shoeData.brand && 
      find.shoeData.model === shoeData.model && 
      find.shoeData.price.usd === shoeData.price.usd
    );
    
    if (isDuplicate) {
      console.log('Shoe already exists in recent finds');
    }
    
    return isDuplicate;
  };

  const handleImageCaptured = async (imageUri: string) => {
    // Store the current image URI
    currentImageUriRef.current = imageUri;
    
    // Reset the flag when a new image is captured
    addedToRecentRef.current = false;
    
    // Reset shoe data before capturing a new image
    resetShoeData();
    
    // Capture and identify the shoe
    await captureImage(imageUri);
  };

  // Add to recent finds when shoe is successfully identified
  React.useEffect(() => {
    if (shoeData && imageUri && !addedToRecentRef.current) {
      console.log('Checking if shoe is a duplicate:', shoeData.brand, shoeData.model);
      
      // Check if this is a duplicate shoe
      if (!isDuplicateShoe(shoeData)) {
        console.log('Adding shoe to recent finds:', shoeData.brand, shoeData.model);
        console.log('Image URI:', imageUri);
        
        // Make sure we're using the correct image URI that matches this shoe data
        const imageToUse = currentImageUriRef.current || imageUri;
        
        addRecentFind(shoeData, imageToUse);
        console.log('Added to recent finds successfully');
        
        // Store the identifier of this shoe to prevent duplicates from multiple scans
        lastScannedShoeRef.current = `${shoeData.brand}-${shoeData.model}-${shoeData.price.usd}`;
      } else {
        console.log('Skipping duplicate shoe');
      }
      
      // Set the flag to true to prevent adding the same shoe multiple times
      addedToRecentRef.current = true;
    }
  }, [shoeData, imageUri, addRecentFind, recentFinds]);

  // Reset the flag when the component unmounts
  React.useEffect(() => {
    return () => {
      addedToRecentRef.current = false;
      currentImageUriRef.current = null;
      lastScannedShoeRef.current = null;
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