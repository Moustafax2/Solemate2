import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  const handleScanNow = () => {
    router.push('/(tabs)/scanner');
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">SoleMate</ThemedText>
        <ThemedText type="subtitle">Identify Any Shoe Instantly</ThemedText>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="camera-outline" size={30} color="#2196F3" />
          </View>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">Snap a Photo</ThemedText>
            <ThemedText>Take a picture of any shoe to get started</ThemedText>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="search-outline" size={30} color="#2196F3" />
          </View>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">AI Recognition</ThemedText>
            <ThemedText>Our AI analyzes and identifies the shoe</ThemedText>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="information-circle-outline" size={30} color="#2196F3" />
          </View>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">Get Details</ThemedText>
            <ThemedText>See brand, model, pricing, and more</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.ctaContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScanNow}>
          <Ionicons name="camera-outline" size={24} color="white" />
          <Text style={styles.scanButtonText}>Scan a Shoe Now</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">How It Works</ThemedText>
        <ThemedText style={styles.infoText}>
          SoleMate uses advanced image recognition technology to identify shoes from just a picture. 
          Our AI can recognize thousands of shoe models and provide you with accurate information about
          the brand, model, and current pricing.
        </ThemedText>
        
        <ThemedText style={styles.infoText}>
          Whether you're curious about someone's shoes, looking to buy a pair you just saw,
          or want to check if you're getting a good deal, SoleMate has you covered.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  featureContainer: {
    padding: 20,
    marginBottom: 10,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  ctaContainer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoContainer: {
    padding: 20,
    marginBottom: 30,
  },
  infoText: {
    marginTop: 10,
    lineHeight: 24,
  },
});
