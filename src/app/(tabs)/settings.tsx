import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../store/habitStore';
import { sendTestNotification } from '../../utils/notifications';
import { colors } from '../../constants/theme';

export default function SettingsScreen() {
  const resetAllHabits = useHabitStore((state) => state.resetAllHabits);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [hapticSounds, setHapticSounds] = useState(true);

  const handleTestNotification = async () => {
    const success = await sendTestNotification();
    if (!success) {
      Alert.alert(
        'Notification Permission Needed',
        'Please enable notifications in your phone Settings to receive daily habit reminders.'
      );
    }
  };

  const handleResetPress = () => {
    Alert.alert(
      'Reset All Habits?',
      'This will reset your habits and streaks to default starter data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetAllHabits(),
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Title */}
        <View className="mb-6 mt-2">
          <Text className="text-[12px] text-textMuted uppercase font-semibold tracking-widest">
            PREFERENCES
          </Text>
          <Text className="text-[28px] font-bold text-textPrimary mt-1 tracking-tight">
            Settings
          </Text>
        </View>

        {/* Notifications & Haptics Section */}
        <Text className="text-[11px] font-bold text-textMuted tracking-widest mb-2.5 mt-2 uppercase">
          APP PREFERENCES
        </Text>
        <View className="bg-surface border border-border rounded-2xl px-4 mb-6">
          <View className="flex-row items-center justify-between py-3.5">
            <View className="flex-row items-center gap-3">
              <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
              <Text className="text-[15px] text-textPrimary font-medium">Daily Reminders</Text>
            </View>
            <Switch
              value={dailyReminders}
              onValueChange={setDailyReminders}
              trackColor={{ false: colors.surfaceSubtle, true: colors.textPrimary }}
              thumbColor={colors.background}
            />
          </View>

          <View className="h-[1px] bg-surfaceSubtle" />

          <Pressable
            className="flex-row items-center justify-between py-3.5"
            onPress={handleTestNotification}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="paper-plane-outline" size={18} color={colors.categories.health} />
              <Text className="text-sm text-catHealth font-semibold">
                Send Test Notification
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>

          <View className="h-[1px] bg-surfaceSubtle" />

          <View className="flex-row items-center justify-between py-3.5">
            <View className="flex-row items-center gap-3">
              <Ionicons name="hardware-chip-outline" size={20} color={colors.textSecondary} />
              <Text className="text-[15px] text-textPrimary font-medium">Haptic Feedback</Text>
            </View>
            <Switch
              value={hapticSounds}
              onValueChange={setHapticSounds}
              trackColor={{ false: colors.surfaceSubtle, true: colors.textPrimary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <Text className="text-[11px] font-bold text-textMuted tracking-widest mb-2.5 mt-2 uppercase">
          DATA & STORAGE
        </Text>
        <View className="bg-surface border border-border rounded-2xl px-4 mb-6">
          <Pressable
            className="flex-row items-center justify-between py-3.5"
            onPress={handleResetPress}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="refresh-outline" size={20} color="#f87171" />
              <Text className="text-[15px] text-red-400 font-semibold">Reset Habit Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* About Section */}
        <Text className="text-[11px] font-bold text-textMuted tracking-widest mb-2.5 mt-2 uppercase">
          ABOUT
        </Text>
        <View className="bg-surface border border-border rounded-2xl px-4 mb-6">
          <View className="flex-row items-center justify-between py-3.5 border-b border-surfaceSubtle">
            <Text className="text-[15px] text-textPrimary font-medium">App Version</Text>
            <Text className="text-xs text-textSecondary font-medium">2.0.0 (Expo Router + Zustand)</Text>
          </View>
          <View className="flex-row items-center justify-between py-3.5">
            <Text className="text-[15px] text-textPrimary font-medium">Architecture</Text>
            <Text className="text-xs text-textSecondary font-medium">Tailwind · Expo 57 · Zustand</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

