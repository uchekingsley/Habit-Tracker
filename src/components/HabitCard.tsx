import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit, calculateCurrentStreak, getFormattedDate } from '../types/habit';
import { colors } from '../constants/theme';

interface HabitCardProps {
  habit: Habit;
  selectedDate?: string;
  onToggle: (id: string, dateStr?: string) => void;
  onDelete?: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  selectedDate = getFormattedDate(),
  onToggle,
}) => {
  const safeHistory = habit.history || {};
  const isCompletedOnSelectedDate = !!safeHistory[selectedDate];
  const currentStreak = calculateCurrentStreak(safeHistory);

  const formatReminderTime = (timeStr?: string) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    const displayMin = String(m).padStart(2, '0');
    return `${displayHour}:${displayMin} ${period}`;
  };

  return (
    <View
      className={`mx-4 my-1 rounded-2xl flex-row items-center border pl-3 transition-all ${
        isCompletedOnSelectedDate
          ? 'bg-[#121215] border-zinc-800 opacity-75'
          : 'bg-surface border-border'
      }`}
    >
      {/* Category accent pip */}
      <View
        className="w-1 h-8 rounded-full"
        style={{ backgroundColor: habit.color }}
      />

      <View className="flex-1 flex-row items-center justify-between py-3 px-3">
        {/* Left Info Column */}
        <View className="flex-1 mr-3">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-[10px] font-bold text-textMuted tracking-wider">
              {habit.category.toUpperCase()}
            </Text>
            {habit.reminderTime && (
              <View className="flex-row items-center bg-surfaceSubtle rounded-md px-1.5 py-0.5 gap-1">
                <Ionicons name="alarm-outline" size={11} color={colors.textSecondary} />
                <Text className="text-[10px] text-textSecondary font-medium">
                  {formatReminderTime(habit.reminderTime)}
                </Text>
              </View>
            )}
          </View>

          <Text
            className={`text-[15px] font-semibold mb-1 ${
              isCompletedOnSelectedDate
                ? 'line-through text-textMuted'
                : 'text-textPrimary'
            }`}
            numberOfLines={1}
          >
            {habit.title}
          </Text>

          {/* Streak indicator */}
          <View className="flex-row items-center">
            <Ionicons name="flame" size={13} color={colors.streak} />
            <Text className="text-[11px] text-textSecondary font-medium ml-1">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>

        {/* Minimalist Checkbox Button */}
        <Pressable
          className={`w-8 h-8 rounded-full items-center justify-center active:scale-90 transition-transform ${
            isCompletedOnSelectedDate
              ? 'bg-textPrimary'
              : 'border-[1.5px] border-zinc-700 bg-transparent'
          }`}
          onPress={() => onToggle(habit.id, selectedDate)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompletedOnSelectedDate }}
        >
          {isCompletedOnSelectedDate && (
            <Ionicons name="checkmark" size={16} color={colors.background} />
          )}
        </Pressable>
      </View>
    </View>
  );
};
