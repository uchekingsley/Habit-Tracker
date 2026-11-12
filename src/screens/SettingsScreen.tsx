import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { sendTestNotification } from '../utils/notifications';
import { colors } from '../constants/theme';

export const SettingsScreen: React.FC = () => {
  const { resetAllHabits } = useHabits();
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
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Title */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>PREFERENCES</Text>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Notifications & Haptics Section */}
        <Text style={styles.sectionHeader}>APP PREFERENCES</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.rowLabel}>Daily Reminders</Text>
            </View>
            <Switch
              value={dailyReminders}
              onValueChange={setDailyReminders}
              trackColor={{ false: colors.surfaceSubtle, true: colors.textPrimary }}
              thumbColor={colors.background}
            />
          </View>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow} onPress={handleTestNotification}>
            <View style={styles.rowLeft}>
              <Ionicons name="paper-plane-outline" size={18} color={colors.categories.health} />
              <Text style={styles.actionLabel}>Send Test Notification</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="hardware-chip-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.rowLabel}>Haptic Feedback</Text>
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
        <Text style={styles.sectionHeader}>DATA & STORAGE</Text>
        <View style={styles.card}>
          <Pressable style={styles.dangerRow} onPress={handleResetPress}>
            <View style={styles.rowLeft}>
              <Ionicons name="refresh-outline" size={20} color="#f87171" />
              <Text style={styles.dangerLabel}>Reset Habit Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* About Section */}
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.versionText}>1.0.0 (Production Build)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Architecture</Text>
            <Text style={styles.versionText}>React Native · Expo 57</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  actionLabel: {
    fontSize: 14,
    color: colors.categories.health,
    fontWeight: '600',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceSubtle,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  dangerLabel: {
    fontSize: 15,
    color: '#f87171',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
