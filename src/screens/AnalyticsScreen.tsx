import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { colors } from '../constants/theme';
import { calculateCurrentStreak } from '../types/habit';

export const AnalyticsScreen: React.FC = () => {
  const { habits, completedCountOnDate, totalCount, completionRateOnDate, longestStreak } =
    useHabits();

  // Category breakdown
  const categoryCounts = habits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>PROGRESS & STATS</Text>
        <Text style={styles.title}>Analytics</Text>
      </View>

      {/* Grid of Metric Cards */}
      <View style={styles.metricsGrid}>
        {/* Metric 1: Completion Rate */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="pie-chart-outline" size={18} color={colors.categories.health} />
            <Text style={styles.metricLabel}>COMPLETION</Text>
          </View>
          <Text style={styles.metricValue}>{completionRateOnDate}%</Text>
          <Text style={styles.metricSubtext}>
            {completedCountOnDate} of {totalCount} completed
          </Text>
        </View>

        {/* Metric 2: Longest Streak */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="flame" size={18} color={colors.streak} />
            <Text style={styles.metricLabel}>BEST STREAK</Text>
          </View>
          <Text style={styles.metricValue}>{longestStreak}d</Text>
          <Text style={styles.metricSubtext}>consecutive days</Text>
        </View>
      </View>

      {/* Habit Breakdown Section */}
      <Text style={styles.sectionHeader}>HABITS BY CATEGORY</Text>
      <View style={styles.categoryContainer}>
        {Object.keys(categoryCounts).length === 0 ? (
          <Text style={styles.emptySubtext}>No habits created yet.</Text>
        ) : (
          Object.entries(categoryCounts).map(([cat, count]) => {
            const percentage = Math.round((count / (totalCount || 1)) * 100);
            return (
              <View key={cat} style={styles.categoryRow}>
                <View style={styles.categoryRowLeft}>
                  <Text style={styles.categoryName}>{cat}</Text>
                  <Text style={styles.categoryCount}>
                    {count} {count === 1 ? 'habit' : 'habits'}
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.categoryPercent}>{percentage}%</Text>
              </View>
            );
          })
        )}
      </View>

      {/* Streak Leaderboard */}
      <Text style={styles.sectionHeader}>STREAK LEADERS</Text>
      <View style={styles.streakList}>
        {habits
          .slice()
          .sort((a, b) => calculateCurrentStreak(b.history) - calculateCurrentStreak(a.history))
          .map((habit, idx) => {
            const currentStreak = calculateCurrentStreak(habit.history);
            return (
              <View key={habit.id} style={styles.streakRow}>
                <Text style={styles.streakRank}>#{idx + 1}</Text>
                <Text style={styles.streakHabitTitle} numberOfLines={1}>
                  {habit.title}
                </Text>
                <View style={styles.flameBadge}>
                  <Ionicons name="flame" size={14} color={colors.streak} />
                  <Text style={styles.streakDays}>{currentStreak}d</Text>
                </View>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
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
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },
  categoryContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryRowLeft: {
    width: 90,
  },
  categoryName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryCount: {
    color: colors.textMuted,
    fontSize: 11,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.textPrimary,
    borderRadius: 3,
  },
  categoryPercent: {
    width: 36,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  streakList: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
  },
  streakRank: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    width: 28,
  },
  streakHabitTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  flameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakDays: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.streak,
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
