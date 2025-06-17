import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Avatar from './Avatar';

export default function StoryItem({ story }) {
  if (story.type === 'create') {
    return (
      <TouchableOpacity style={styles.createStory}>
        <View style={styles.createStoryAvatar}>
          <Avatar source="https://placeholder.com/50x50" size={50} />
          <View style={styles.plusIcon}>
            <Feather name="plus" size={16} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.storyName}>Create story</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.storyItem}>
      <View style={styles.storyContainer}>
        <Avatar 
          source={story.avatar} 
          size={50} 
          hasStory={story.hasStory}
        />
        {story.storyTime && (
          <View style={styles.storyTime}>
            <Text style={styles.storyTimeText}>{story.storyTime}</Text>
          </View>
        )}
        {story.isActive && (
          <View style={styles.activeIndicator} />
        )}
      </View>
      <Text style={styles.storyName} numberOfLines={1}>
        {story.name}
      </Text>
      {story.note && (
        <View style={styles.notePreview}>
          <Text style={styles.noteText} numberOfLines={2}>
            {story.note}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  createStory: {
    alignItems: 'center',
    marginRight: 12,
    width: 70,
  },
  createStoryAvatar: {
    position: 'relative',
    marginBottom: 8,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0084FF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 12,
    width: 70,
  },
  storyContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  storyTime: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    transform: [{ translateX: -15 }],
    backgroundColor: '#30D158',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  storyTimeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#30D158',
    borderWidth: 2,
    borderColor: '#000000',
  },
  storyName: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  notePreview: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 6,
    maxWidth: 120,
    position: 'absolute',
    top: 70,
    left: -25,
  },
  noteText: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});