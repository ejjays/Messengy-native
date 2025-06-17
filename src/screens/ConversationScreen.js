import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Channel, MessageList, MessageInput } from 'stream-chat-expo';

export default function ConversationScreen({ route }) {
  const { channel } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});