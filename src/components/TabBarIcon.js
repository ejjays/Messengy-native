import React from 'react';
import { Feather } from '@expo/vector-icons';

export default function TabBarIcon({ name, color, focused }) {
  return (
    <Feather 
      name={name} 
      size={24} 
      color={color}
      style={{ 
        opacity: focused ? 1 : 0.7,
        transform: [{ scale: focused ? 1.1 : 1 }]
      }}
    />
  );
}