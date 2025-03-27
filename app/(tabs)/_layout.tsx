import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { HapticTab } from '@/components/HapticTab';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <TabBarIcon name="camera-outline" color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/shoe-scanner');
          },
        })}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={styles.tabBarIcon} {...props} />;
}

const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -4,
  },
  tabLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
  },
});
