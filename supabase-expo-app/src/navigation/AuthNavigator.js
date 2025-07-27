import React from 'react';
import { View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';

export default function AuthNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <LoginScreen />
    </View>
  );
}