import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, Image, TextInput, Alert, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/components/auth/AuthContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const recentFinds = [
    { id: 1, name: 'Nike Air Force 1', image: require('@/assets/images/airforce1.png') },
    { id: 2, name: 'Adidas Samba', image: require('@/assets/images/adidassamba.png') },
    { id: 3, name: 'Nike Air Max 97', image: require('@/assets/images/airmax97.png') },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recentFinds.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + recentFinds.length) % recentFinds.length);
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
        <View style={styles.carouselContainer}>
          <TouchableOpacity 
            style={styles.carouselArrow} 
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={24} color="rgb(227, 41, 36)" />
          </TouchableOpacity>

          <View style={styles.carouselContent}>
            <Image 
              source={recentFinds[currentIndex].image} 
              style={styles.sneakerImage}
            />
            <ThemedText style={styles.sneakerName}>{recentFinds[currentIndex].name}</ThemedText>
          </View>

          <TouchableOpacity 
            style={styles.carouselArrow} 
            onPress={handleNext}
          >
            <Ionicons name="chevron-forward" size={24} color="rgb(227, 41, 36)" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 10,
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
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'rgb(227, 41, 36)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#666',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    width: '100%',
  },
  carouselContent: {
    flex: 1,
    alignItems: 'center',
    width: '70%',
    paddingHorizontal: 10,
  },
  carouselArrow: {
    padding: 15,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sneakerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  sneakerName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
  },
}); 