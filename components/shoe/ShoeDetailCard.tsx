import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { ShoeData } from './GeminiService';
import { useRatings } from './RatingsContext';

interface ShoeDetailCardProps {
  shoeData: ShoeData;
  imageUri: string;
}

export default function ShoeDetailCard({ shoeData, imageUri }: ShoeDetailCardProps) {
  const { addRating, getRating } = useRatings();
  const shoeId = `${shoeData.brand}-${shoeData.model}-${shoeData.price.usd}`;
  const [currentRating, setCurrentRating] = useState<number>(getRating(shoeId) || 0);
  const [hasRated, setHasRated] = useState<boolean>(getRating(shoeId) !== null);

  const searchOnline = () => {
    const searchQuery = `${shoeData.brand} ${shoeData.model}`;
    Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const shopNow = () => {
    const searchQuery = `buy ${shoeData.brand} ${shoeData.model}`;
    Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Function to get rarity badge color
  const getRarityColor = (level: string) => {
    switch (level) {
      case 'Common':
        return '#8E8E93'; // Gray
      case 'Uncommon':
        return '#34C759'; // Green
      case 'Rare':
        return '#007AFF'; // Blue
      case 'Ultra Rare':
        return '#AF52DE'; // Purple
      case 'Legendary':
        return '#FF9500'; // Orange/Gold
      default:
        return '#8E8E93'; // Default gray
    }
  };

  // Function to get rarity icon
  const getRarityIcon = (level: string) => {
    switch (level) {
      case 'Common':
        return 'star-outline';
      case 'Uncommon':
        return 'star';
      case 'Rare':
        return 'star-half';
      case 'Ultra Rare':
        return 'star';
      case 'Legendary':
        return 'diamond';
      default:
        return 'star-outline';
    }
  };

  const handleRating = async (rating: number) => {
    setCurrentRating(rating);
    setHasRated(true);
    await addRating(shoeId, rating);
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= currentRating ? 'star' : 'star-outline'}
              size={24}
              color={star <= currentRating ? '#FFD700' : '#D3D3D3'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
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
        
        {/* Rarity Badge */}
        {shoeData.rarity && (
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(shoeData.rarity.level) }]}>
            <Ionicons name={getRarityIcon(shoeData.rarity.level)} size={16} color="white" />
            <Text style={styles.rarityText}>{shoeData.rarity.level}</Text>
          </View>
        )}
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

        {/* Rarity Section */}
        {shoeData.rarity && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Collector Info</ThemedText>
            <View style={styles.rarityContainer}>
              <View style={styles.rarityInfo}>
                <View style={styles.rarityLabelContainer}>
                  <Ionicons name={getRarityIcon(shoeData.rarity.level)} size={20} color={getRarityColor(shoeData.rarity.level)} />
                  <ThemedText style={styles.rarityLabel}>Rarity:</ThemedText>
                </View>
                <ThemedText style={[styles.rarityValue, { color: getRarityColor(shoeData.rarity.level) }]}>
                  {shoeData.rarity.level}
                </ThemedText>
              </View>
              
              <View style={styles.rarityInfo}>
                <View style={styles.rarityLabelContainer}>
                  <Ionicons name="cash-outline" size={20} color="#666" />
                  <ThemedText style={styles.rarityLabel}>Collector Value:</ThemedText>
                </View>
                <ThemedText style={styles.rarityValue}>
                  ${shoeData.rarity.collectorValue}
                </ThemedText>
              </View>
              
              <ThemedText style={styles.rarityDescription}>
                {shoeData.rarity.description}
              </ThemedText>
            </View>
          </ThemedView>
        )}

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

                {/* Rating Section */}
        <ThemedView style={styles.ratingSection}>
          <ThemedText type="subtitle">How'd we do?</ThemedText>
          {hasRated ? (
            <View style={styles.ratingContainer}>
              <ThemedText style={styles.ratingText}>Thanks for rating!</ThemedText>
              {renderStars()}
            </View>
          ) : (
            <View style={styles.ratingContainer}>
              <ThemedText style={styles.ratingText}>Rate our shoe identification:</ThemedText>
              {renderStars()}
            </View>
          )}
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
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  confidenceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  confidenceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  rarityBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rarityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  brand: {
    fontSize: 18,
    opacity: 0.7,
  },
  model: {
    fontSize: 24,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  price: {
    fontSize: 22,
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
    fontSize: 14,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  colorText: {
    fontSize: 12,
  },
  description: {
    marginTop: 10,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  shopButton: {
    backgroundColor: 'rgb(227, 41, 36)',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
  rarityContainer: {
    marginTop: 10,
  },
  rarityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rarityLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rarityLabel: {
    marginLeft: 5,
    fontSize: 14,
  },
  rarityValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  rarityDescription: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  ratingSection: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(227, 41, 36, 0.05)',
  },
  ratingContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButton: {
    padding: 5,
  },
}); 