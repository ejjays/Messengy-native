import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '@clerk/clerk-expo';
import Avatar from '../components/Avatar';
import { Colors } from '../constants/Colors';

export default function FriendsScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { client } = useChatContext();
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Query for users (excluding current user)
      const response = await client.queryUsers(
        { id: { $ne: client.user.id } },
        { last_active: -1 },
        { limit: 20 }
      );
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (targetUser) => {
    try {
      const channel = client.channel('messaging', {
        members: [client.user.id, targetUser.id],
        name: `${client.user.name}, ${targetUser.name}`,
      });
      
      await channel.create();
      Alert.alert('Success', `Started chat with ${targetUser.name}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Failed to start chat');
    }
  };

  const renderUserItem = ({ item: targetUser }) => (
    <View style={styles.userItem}>
      <Avatar
        source={targetUser.image || `https://getstream.io/random_png/?id=${targetUser.id}&name=${targetUser.name}`}
        size={50}
        isOnline={targetUser.online}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{targetUser.name || 'Unknown User'}</Text>
        <Text style={styles.userStatus}>
          {targetUser.online ? 'Online' : 'Offline'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => startChat(targetUser)}
      >
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading friends...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add to Story Section */}
        <View style={styles.storiesSection}>
          <TouchableOpacity style={styles.addStoryButton}>
            <View style={styles.addStoryIcon}>
              <Feather name="plus" size={24} color={Colors.white} />
            </View>
            <Text style={styles.addStoryText}>Add to story</Text>
          </TouchableOpacity>
        </View>

        {/* Friends List */}
        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>People you may know</Text>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.primaryText,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  content: {
    flex: 1,
  },
  storiesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  addStoryButton: {
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 16,
    padding: 20,
  },
  addStoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addStoryText: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '500',
  },
  friendsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  chatButton: {
    backgroundColor: Colors.blue,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});