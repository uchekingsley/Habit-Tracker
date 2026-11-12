import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useHabitStore } from '../store/habitStore';
import { colors } from '../constants/theme';
import '../../global.css';

export default function RootLayout() {
  const initialize = useHabitStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

