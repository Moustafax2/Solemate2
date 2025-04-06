import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  const handleScanNow = () => {
    router.push('/(tabs)/scanner');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <ScrollView style={styles.container}>
  
      <ThemedView style={styles.titleContainer}>

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={handleProfilePress}
        >
          <Ionicons name="person-circle-outline" size={32} color="rgb(227, 41, 36)" />
        </TouchableOpacity>
      </View>
        <View style={styles.titleRow}>
          <Image 
            source={require('@/assets/images/SolemateLOGO_RED.png')} 
            style={styles.logo}
            tintColor="rgb(227, 41, 36)"
          />
          <ThemedText type="title">SoleMate</ThemedText>
        </View>
        <ThemedText type="subtitle">Identify Any Shoe Instantly</ThemedText>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="camera-outline" size={30} color="white" />  
          </View>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">Snap a Photo</ThemedText>
            <ThemedText>Take a picture of any shoe to get started</ThemedText>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="search-outline" size={30} color="white" />
          </View>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">AI Recognition</ThemedText>
            <ThemedText>Our AI analyzes and identifies the shoe</ThemedText>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="information-circle-outline" size={30} color="white" />
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

      <ThemedView style={styles.recentFindsContainer}>
        <ThemedText type="title" style={styles.recentFindsTitle}>Community Finds</ThemedText>
        <View style={styles.recentFindsList}>
          <View style={styles.recentFindItem}>
            <Image 
              source={require('@/assets/images/airforce1.png')} 
              style={styles.sneakerImage}
            />
            <ThemedText style={styles.sneakerName}>Nike Air Force 1</ThemedText>
          </View>
          <View style={styles.recentFindItem}>
            <Image 
              source={require('@/assets/images/adidassamba.png')} 
              style={styles.sneakerImage}
            />
            <ThemedText style={styles.sneakerName}>Adidas Samba</ThemedText>
          </View>
          <View style={styles.recentFindItem}>
            <Image 
              source={require('@/assets/images/airmax97.png')} 
              style={styles.sneakerImage}
            />
            <ThemedText style={styles.sneakerName}>Nike Air Max 97</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText type="title" style={styles.infoTitle}>How It Works</ThemedText>
        <View style={styles.infoCard}>
          <ThemedText style={styles.infoText}>
            SoleMate uses advanced image recognition technology to identify shoes from just a picture. 
            Our AI can recognize thousands of shoe models and provide you with accurate information about
            the brand, model, and current pricing.
          </ThemedText>
          
          <ThemedText style={styles.infoText}>
            Whether you're curious about someone's shoes, looking to buy a pair you just saw,
            or want to check if you're getting a good deal, SoleMate has you covered.
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  profileButton: {
    padding: 10,
    backgroundColor: 'rgba(36, 227, 49, 0)',
    borderRadius: 25,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 20,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
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
    backgroundColor: 'rgb(227, 41, 36)',
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
    backgroundColor: 'rgb(227, 41, 36)',
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
  recentFindsContainer: {
    padding: 20,
    marginBottom: 20,
  },
  recentFindsTitle: {
    marginBottom: 15,
  },
  recentFindsList: {
    gap: 20,
  },
  recentFindItem: {
    alignItems: 'flex-start',
  },
  sneakerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  sneakerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(227, 41, 36, 0.07)',
    borderRadius: 15,
    marginHorizontal: 10,
  },
  infoTitle: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    marginTop: 15,
    lineHeight: 24,
    fontSize: 16,
    color: '#444',
  },
});
