import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../store/habitStore';
import { colors } from '../../constants/theme';
import { calculateCurrentStreak } from '../../types/habit';

export default function AnalyticsScreen() {
  const habits = useHabitStore((state) => state.habits);
  const totalCount = useHabitStore((state) => state.getTotalCount());
  const completedCountOnDate = useHabitStore((state) =>
    state.getCompletedCountOnDate(state.selectedDate)
  );
  const completionRateOnDate = useHabitStore((state) =>
    state.getCompletionRateOnDate(state.selectedDate)
  );
  const longestStreak = useHabitStore((state) => state.getLongestStreak());

  const categoryCounts = habits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-5">
          <Text className="text-[12px] text-textMuted uppercase font-semibold tracking-widest">
            PROGRESS & STATS
          </Text>
          <Text className="text-[28px] font-bold text-textPrimary mt-1 tracking-tight">
            Analytics
          </Text>
        </View>

        {/* Metric Cards Grid */}
        <View className="flex-row gap-3 mb-7">
          <View className="flex-1 bg-surface border border-border rounded-2xl p-4">
            <View className="flex-row items-center gap-1.5 mb-2.5">
              <Ionicons name="pie-chart-outline" size={18} color={colors.categories.health} />
              <Text className="text-[10px] font-bold text-textMuted tracking-wider">
                COMPLETION
              </Text>
            </View>
            <Text className="text-[28px] font-extrabold text-textPrimary mb-1">
              {completionRateOnDate}%
            </Text>
            <Text className="text-xs text-textSecondary">
              {completedCountOnDate} of {totalCount} completed
            </Text>
          </View>

          <View className="flex-1 bg-surface border border-border rounded-2xl p-4">
            <View className="flex-row items-center gap-1.5 mb-2.5">
              <Ionicons name="flame" size={18} color={colors.streak} />
              <Text className="text-[10px] font-bold text-textMuted tracking-wider">
                BEST STREAK
              </Text>
            </View>
            <Text className="text-[28px] font-extrabold text-textPrimary mb-1">
              {longestStreak}d
            </Text>
            <Text className="text-xs text-textSecondary">consecutive days</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <Text className="text-[11px] font-bold text-textMuted tracking-widest mb-3 uppercase">
          HABITS BY CATEGORY
        </Text>
        <View className="bg-surface border border-border rounded-2xl p-4 mb-7">
          {Object.keys(categoryCounts).length === 0 ? (
            <Text className="text-textMuted text-xs">No habits created yet.</Text>
          ) : (
            Object.entries(categoryCounts).map(([cat, count]) => {
              const percentage = Math.round((count / (totalCount || 1)) * 100);
              return (
                <View key={cat} className="flex-row items-center mb-3.5 last:mb-0">
                  <View className="w-24">
                    <Text className="text-textPrimary text-xs font-semibold">{cat}</Text>
                    <Text className="text-textMuted text-[10px]">
                      {count} {count === 1 ? 'habit' : 'habits'}
                    </Text>
                  </View>
                  <View className="flex-1 h-1.5 bg-surfaceSubtle rounded-full mx-3 overflow-hidden">
                    <View
                      className="h-full bg-textPrimary rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  <Text className="w-9 text-right text-xs font-semibold text-textSecondary">
                    {percentage}%
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Streak Leaderboard */}
        <Text className="text-[11px] font-bold text-textMuted tracking-widest mb-3 uppercase">
          STREAK LEADERS
        </Text>
        <View className="bg-surface border border-border rounded-2xl px-4 py-2">
          {habits
            .slice()
            .sort((a, b) => calculateCurrentStreak(b.history) - calculateCurrentStreak(a.history))
            .map((habit, idx) => {
              const currentStreak = calculateCurrentStreak(habit.history);
              return (
                <View
                  key={habit.id}
                  className="flex-row items-center py-3 border-b border-surfaceSubtle last:border-b-0"
                >
                  <Text className="text-xs font-bold text-textMuted w-7">#{idx + 1}</Text>
                  <Text className="flex-1 text-sm text-textPrimary font-medium mr-2" numberOfLines={1}>
                    {habit.title}
                  </Text>
                  <View className="flex-row items-center bg-surfaceSubtle px-2 py-1 rounded-full gap-1">
                    <Ionicons name="flame" size={13} color={colors.streak} />
                    <Text className="text-xs font-semibold text-streak">{currentStreak}d</Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

