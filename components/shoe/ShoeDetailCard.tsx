import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface ShoeDetailCardProps {
  shoeData: {
    brand: string;
    model: string;
    price: {
      usd: number;
      range: string;
    };
    releaseYear: number;
    type: string;
    colors: string[];
    popularity: string;
    description: string;
    confidence: number;
  };
  imageUri: string;
}

export default function ShoeDetailCard({ shoeData, imageUri }: ShoeDetailCardProps) {
  const searchOnline = () => {
    const searchQuery = `${shoeData.brand} ${shoeData.model}`;
    Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const shopNow = () => {
    const searchQuery = `buy ${shoeData.brand} ${shoeData.model}`;
    Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>
            {Math.round(shoeData.confidence * 100)}% Match
          </Text>
        </View>
      </View>

      <ThemedView style={styles.detailsContainer}>
        <ThemedText type="subtitle" style={styles.brand}>{shoeData.brand}</ThemedText>
        <ThemedText type="title" style={styles.model}>{shoeData.model}</ThemedText>
        
        <View style={styles.priceContainer}>
          <ThemedText type="defaultSemiBold" style={styles.price}>
            ${shoeData.price.usd}
          </ThemedText>
          <ThemedText style={styles.priceRange}>
            Price Range: {shoeData.price.range}
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <ThemedText style={styles.detailText}>
              {shoeData.releaseYear}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="footsteps-outline" size={20} color="#666" />
            <ThemedText style={styles.detailText}>
              {shoeData.type}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="trending-up-outline" size={20} color="#666" />
            <ThemedText style={styles.detailText}>
              {shoeData.popularity}
            </ThemedText>
          </View>
        </View>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Colors</ThemedText>
          <View style={styles.colorContainer}>
            {shoeData.colors.map((color, index) => (
              <View key={index} style={styles.colorBadge}>
                <ThemedText style={styles.colorText}>{color}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText style={styles.description}>
            {shoeData.description}
          </ThemedText>
        </ThemedView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={searchOnline}>
            <Ionicons name="search-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Learn More</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.shopButton]} onPress={shopNow}>
            <Ionicons name="cart-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  confidenceBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  confidenceText: {
    color: 'white',
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 20,
  },
  brand: {
    fontSize: 16,
    opacity: 0.7,
  },
  model: {
    fontSize: 24,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    marginRight: 10,
  },
  priceRange: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
  },
  section: {
    marginBottom: 20,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  colorBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  colorText: {
    fontSize: 14,
  },
  description: {
    marginTop: 10,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  shopButton: {
    backgroundColor: '#2196F3',
    marginRight: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
}); 