import React from 'react';
import { View } from 'react-native';
import ProfileListScreen from '../screens/ProfileListScreen';

export default function MainNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <ProfileListScreen />
    </View>
  );
}