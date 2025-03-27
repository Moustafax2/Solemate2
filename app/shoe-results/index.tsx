import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ShoeDetailCard from '@/components/shoe/ShoeDetailCard';
import { useShoe } from '@/components/shoe/ShoeContext';

export default function ShoeResults() {
  const { shoeData, imageUri, isLoading, error } = useShoe();
  const router = useRouter();

  useEffect(() => {
    // If no image data, redirect back to scanner
    if (!imageUri && !isLoading) {
      // @ts-ignore
      router.replace('/shoe-scanner');
    }
  }, [imageUri, isLoading, router]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Shoe Details',
          headerTintColor: '#333',
        }}
      />
      <StatusBar style="dark" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Analyzing your shoe...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorHint}>Please try again with a clearer image or different angle.</Text>
        </View>
      ) : shoeData && imageUri ? (
        <ShoeDetailCard shoeData={shoeData} imageUri={imageUri} />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2196F3" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#e53935',
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  errorHint: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 