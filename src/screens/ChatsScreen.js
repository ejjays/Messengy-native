import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '@clerk/clerk-expo';
import Avatar from '../components/Avatar';
import StoryItem from '../components/StoryItem';

export default function ChatsScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { client } = useChatContext();
  const { user } = useAuth();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        if (client.user) {
          const filter = { 
            type: 'messaging', 
            members: { $in: [client.user.id] } 
          };
          const sort = { last_message_at: -1 };
          const channels = await client.queryChannels(filter, sort, {
            watch: true,
            state: true,
          });
          setChannels(channels);
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();

    // Listen for new channels
    const handleEvent = (event) => {
      if (event.type === 'notification.added_to_channel') {
        fetchChannels();
      }
    };

    client.on('notification.added_to_channel', handleEvent);
    return () => client.off('notification.added_to_channel', handleEvent);
  }, [client]);

  const createNewChat = async () => {
    try {
      // Create a new channel with a demo user
      const channel = client.channel('messaging', {
        members: [client.user.id, 'demo-user-2'],
        name: 'New Chat',
      });
      await channel.create();
      navigation.navigate('Conversation', { channel });
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  const renderChatItem = ({ item: channel }) => {
    const otherMember = Object.values(channel.state.members).find(
      member => member.user.id !== client.user.id
    );
    
    const lastMessage = channel.state.messages[channel.state.messages.length - 1];
    const unreadCount = channel.countUnread();

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('Conversation', { channel })}
      >
        <View style={styles.avatarContainer}>
          <Avatar
            source={otherMember?.user?.image || `https://getstream.io/random_png/?id=${otherMember?.user?.id}&name=${otherMember?.user?.name}`}
            size={56}
            isOnline={otherMember?.user?.online}
          />
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>
              {otherMember?.user?.name || channel.data.name || 'Unknown'}
            </Text>
            <Text style={styles.timestamp}>
              {lastMessage ? formatTime(lastMessage.created_at) : ''}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage?.text || 'No messages yet'}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>messenger</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={createNewChat}>
            <Feather name="edit" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <View style={styles.metaAiIcon}>
            <View style={styles.metaAiGradient} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Ask Meta AI or search"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Stories/Notes Rail */}
      <View style={styles.storiesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <StoryItem story={{ id: 'create', type: 'create', name: 'Create story' }} />
          {/* Add more dynamic stories here */}
        </ScrollView>
      </View>

      {/* Chat List */}
      {channels.length > 0 ? (
        <FlatList
          data={channels}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chats yet</Text>
          <TouchableOpacity style={styles.startChatButton} onPress={createNewChat}>
            <Text style={styles.startChatText}>Start a new chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaAiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    overflow: 'hidden',
  },
  metaAiGradient: {
    flex: 1,
    backgroundColor: '#0084FF',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  storiesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 14,
    color: '#8E8E93',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
  },
  unreadBadge: {
    backgroundColor: '#0084FF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 16,
  },
  startChatButton: {
    backgroundColor: '#0084FF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  startChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});