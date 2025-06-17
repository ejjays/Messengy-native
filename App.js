import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import * as SecureStore from 'expo-secure-store';

// Screens
import ChatsScreen from './src/screens/ChatsScreen';
import ConversationScreen from './src/screens/ConversationScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import AuthScreen from './src/screens/AuthScreen';
import LoadingScreen from './src/screens/LoadingScreen';

// Components
import TabBarIcon from './src/components/TabBarIcon';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Initialize Stream Chat
const chatClient = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

// Clerk token cache
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function ChatsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' }
      }}
    >
      <Stack.Screen name="ChatsList" component={ChatsScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          borderTopWidth: 0.5,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0084FF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatsStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="message-circle" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="users" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="bell" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();

  useEffect(() => {
    const connectStreamChat = async () => {
      if (isSignedIn && userId) {
        try {
          // Get Clerk token and connect to Stream
          const token = await getToken({ template: 'stream' });
          await chatClient.connectUser(
            {
              id: userId,
              name: 'User', // You can get this from Clerk user data
            },
            token
          );
        } catch (error) {
          console.error('Stream connection error:', error);
        }
      }
    };

    connectStreamChat();

    return () => {
      if (chatClient.user) {
        chatClient.disconnectUser();
      }
    };
  }, [isSignedIn, userId, getToken]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <AuthScreen />;
  }

  return (
    <Chat client={chatClient}>
      <MainTabs />
    </Chat>
  );
}

export default function App() {
  return (
    <ClerkProvider 
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <OverlayProvider>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: '#0084FF',
              background: '#000000',
              card: '#000000',
              text: '#FFFFFF',
              border: '#333333',
              notification: '#FF3B30',
            },
          }}
        >
          <StatusBar style="light" backgroundColor="#000000" />
          <AppContent />
        </NavigationContainer>
      </OverlayProvider>
    </ClerkProvider>
  );
}