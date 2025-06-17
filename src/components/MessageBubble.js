import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar';

export default function MessageBubble({ message }) {
  return (
    <View style={[
      styles.container,
      message.isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      {!message.isOwn && (
        <Avatar source={message.avatar} size={24} />
      )}
      <View style={[
        styles.bubble,
        message.isOwn ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isOwn ? styles.ownText : styles.otherText
        ]}>
          {message.text}
        </Text>
      </View>
      {message.hasReaction && (
        <View style={styles.reactionContainer}>
          <Text style={styles.reaction}>{message.reaction}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2,
  },
  ownMessage: {
    justifyContent: 'flex-end',
    paddingLeft: 50,
  },
  otherMessage: {
    justifyContent: 'flex-start',
    paddingRight: 50,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxWidth: '80%',
    marginHorizontal: 8,
  },
  ownBubble: {
    backgroundColor: '#0084FF',
  },
  otherBubble: {
    backgroundColor: '#3A3A3C',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#FFFFFF',
  },
  reactionContainer: {
    position: 'absolute',
    bottom: -8,
    right: 8,
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#333333',
  },
  reaction: {
    fontSize: 12,
  },
});