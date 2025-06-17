import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '@clerk/clerk-expo';
import Avatar from '../components/Avatar';
import { Colors } from '../constants/Colors';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { client } = useChatContext();
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Get recent channel events as notifications
      const channels = await client.queryChannels(
        { members: { $in: [client.user.id] } },
        { last_message_at: -1 },
        { limit: 10 }
      );

      const notificationData = channels.map((channel, index) => {
        const otherMember = Object.values(channel.state.members).find(
          member => member.user.id !== client.user.id
        );

        return {
          id: `notification-${index}`,
          user: {
            name: otherMember?.user?.name || 'Unknown User',
            avatar: otherMember?.user?.image || `https://getstream.io/random_png/?id=${otherMember?.user?.id}&name=${otherMember?.user?.name}`,
          },
          message: 'Started a conversation with you',
          timestamp: formatTimeAgo(channel.data.created_at),
          isUnread: channel.countUnread() > 0,
          type: 'new_chat',
        };
      });

      setNotifications(notificationData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = (now - notificationDate) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d`;
    } else {
      return `${Math.floor(diffInHours / 168)}w`;
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <Avatar source={item.user.avatar} size={56} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.message}> {item.message}</Text>
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      {item.isUnread && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Recent</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderSectionHeader}
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    color: Colors.primaryText,
  },
  message: {
    color: Colors.primaryText,
  },
  timestamp: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  unreadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.unread,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
});