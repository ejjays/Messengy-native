import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Avatar({ 
  source, 
  size = 50, 
  isOnline = false, 
  hasStory = false 
}) {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const onlineIndicatorStyle = {
    width: size * 0.25,
    height: size * 0.25,
    borderRadius: (size * 0.25) / 2,
    bottom: size * 0.05,
    right: size * 0.05,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, hasStory && styles.storyBorder]}>
        <Image
          source={{ uri: source }}
          style={[styles.avatar, avatarStyle]}
          defaultSource={{ uri: 'https://placeholder.com/50x50' }}
        />
      </View>
      {isOnline && (
        <View style={[styles.onlineIndicator, onlineIndicatorStyle]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarContainer: {
    borderRadius: 50,
    padding: 2,
  },
  storyBorder: {
    borderWidth: 2,
    borderColor: '#0084FF',
  },
  avatar: {
    backgroundColor: '#1C1C1E',
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: '#30D158',
    borderWidth: 2,
    borderColor: '#000000',
  },
});