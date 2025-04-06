import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, Image, TextInput, Alert, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/components/auth/AuthContext';
import { useRecentFinds } from '@/components/shoe/RecentFindsContext';
import { useCommunityFinds } from '@/components/shoe/CommunityFindsContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { recentFinds } = useRecentFinds();
  const { addCommunityFind } = useCommunityFinds();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback data if no recent finds
  const fallbackFinds = [
    { id: 1, name: 'Nike Air Force 1', image: require('@/assets/images/airforce1.png') },
    { id: 2, name: 'Adidas Samba', image: require('@/assets/images/adidassamba.png') },
    { id: 3, name: 'Nike Air Max 97', image: require('@/assets/images/airmax97.png') },
  ];

  const handleNext = () => {
    const maxIndex = recentFinds.length > 0 ? recentFinds.length - 1 : fallbackFinds.length - 1;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (maxIndex + 1));
  };

  const handlePrevious = () => {
    const maxIndex = recentFinds.length > 0 ? recentFinds.length - 1 : fallbackFinds.length - 1;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (maxIndex + 1)) % (maxIndex + 1));
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update logic
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    // TODO: Implement password change logic
    Alert.alert('Success', 'Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPassword(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleShoePress = (shoeData: any, imageUri: any) => {
    // Navigate to shoe results with the selected shoe data
    router.push({
      pathname: '/shoe-results',
      params: {
        shoeData: JSON.stringify(shoeData),
        imageUri: typeof imageUri === 'string' ? imageUri : JSON.stringify(imageUri),
        isFromCommunity: 'true'
      },
    });
  };

  const handleUploadToCommunity = (shoeData: any, imageUri: any) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to share to community finds');
      return;
    }

    addCommunityFind(
      shoeData, 
      imageUri, 
      user.username || 'anonymous',
      user.username || 'anonymous'
    );
    Alert.alert('Success', 'Your find has been shared with the community!');
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerTintColor: '#333',
          headerBackTitle: ' ',
        }}
      />
      <StatusBar style="dark" />

      <ThemedView style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={80} color="rgb(227, 41, 36)" />
        </View>
        <ThemedText type="title" style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.email}>{email}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Account Settings</ThemedText>
        
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSaveProfile}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>{username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Change Password</ThemedText>
        
        {isChangingPassword ? (
          <>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Current Password</ThemedText>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Current Password"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>New Password</ThemedText>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="New Password"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Confirm New Password</ThemedText>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm New Password"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Save Password</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setIsChangingPassword(true)}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Finds</ThemedText>
        
        {recentFinds.length > 0 ? (
          <View style={styles.recentFindsContainer}>
            {recentFinds.map((find, index) => (
              <View key={index} style={styles.findItem}>
                <TouchableOpacity 
                  style={styles.findImageContainer}
                  onPress={() => handleShoePress(find.shoeData, find.imageUri)}
                >
                  <Image 
                    source={typeof find.imageUri === 'string' 
                      ? { uri: find.imageUri } 
                      : find.imageUri} 
                    style={styles.findImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                
                <View style={styles.findDetails}>
                  <TouchableOpacity 
                    onPress={() => handleShoePress(find.shoeData, find.imageUri)}
                  >
                    <ThemedText style={styles.findName}>
                      {find.shoeData.brand} {find.shoeData.model}
                    </ThemedText>
                    <ThemedText style={styles.findPrice}>
                      ${find.shoeData.price.usd}
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.shareButton}
                    onPress={() => handleUploadToCommunity(find.shoeData, find.imageUri)}
                  >
                    <Ionicons name="share-social-outline" size={16} color="white" />
                    <Text style={styles.shareButtonText}>Share With Community</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyFindsContainer}>
            <Ionicons name="camera-outline" size={50} color="#ccc" />
            <ThemedText style={styles.emptyFindsText}>
              No recent finds yet. Scan a shoe to see it here!
            </ThemedText>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => router.push('/shoe-scanner')}
            >
              <Text style={styles.scanButtonText}>Scan a Shoe</Text>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    marginBottom: 5,
  },
  email: {
    opacity: 0.7,
  },
  section: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    marginBottom: 15,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
  },
  button: {
    backgroundColor: 'rgb(227, 41, 36)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  recentFindsContainer: {
    width: '100%',
  },
  findItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  findImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  findImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  findDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  findName: {
    fontSize: 16,
    fontWeight: '600',
  },
  findPrice: {
    fontSize: 14,
    color: 'rgb(227, 41, 36)',
    marginTop: 4,
  },
  emptyFindsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyFindsText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    opacity: 0.7,
  },
  scanButton: {
    backgroundColor: 'rgb(227, 41, 36)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    margin: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutButtonText: {
    color: 'rgb(227, 41, 36)',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(227, 41, 36)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
}); 