import { Tabs } from 'expo-router/tabs';
import { Platform, View, Pressable, useColorScheme } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../constants/Styles';

// Primary brand color that stays consistent regardless of theme
const BRAND_BLUE = '#4B76E5';

const DefaultTabButton = (props) => {
  const { accessibilityState, onPress, children } = props;

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
    >
      {children}
    </Pressable>
  );
};

const DefaultTabBarBackground = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#0E0E0F' : '#F9F9F9';

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 85,
        backgroundColor,
        borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
        borderTopColor: colorScheme === 'dark' ? '#1A1A1A' : '#DADADA',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -4 },
      }}
    />
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';

  const TabButton = (() => {
    try {
      const { HapticTab } = require('@/components/HapticTab');
      return HapticTab || DefaultTabButton;
    } catch {
      return DefaultTabButton;
    }
  })();

  const TabBackground = (() => {
    try {
      return require('@/components/ui/TabBarBackground').default || DefaultTabBarBackground;
    } catch {
      return DefaultTabBarBackground;
    }
  })();

  // Using textColor based on theme for labels only
  const tabTextColor = colorScheme === 'dark' ? '#8E8E93' : '#8E8E93';
  const tabActiveTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabActiveTextColor,
        tabBarInactiveTintColor: tabTextColor,
        headerShown: false,
        tabBarButton: (props) => <TabButton {...props} />,
        tabBarBackground: () => <TabBackground />,
        tabBarStyle: Platform.select({
          ios: { 
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
          android: {
            backgroundColor: 'transparent',
          },
        }),
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={BRAND_BLUE} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? "compass" : "compass-outline"} 
              size={24} 
              color={BRAND_BLUE} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="active-plans"
        options={{
          title: 'Plans',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? "document-text" : "document-text-outline"} 
              size={24} 
              color={BRAND_BLUE} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? "person-circle" : "person-circle-outline"} 
              size={24} 
              color={BRAND_BLUE} 
            />
          ),
        }}
      />
    </Tabs>
  );
}