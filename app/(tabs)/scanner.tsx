import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function ScannerTab() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the shoe scanner screen when this tab is rendered
    router.push('/shoe-scanner');
  }, [router]);

  // This screen should never be visible as it immediately redirects
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting to scanner...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
}); 