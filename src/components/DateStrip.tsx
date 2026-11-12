import React from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { getFormattedDate } from '../types/habit';

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export const DateStrip: React.FC<DateStripProps> = ({ selectedDate, onSelectDate }) => {
  const today = new Date();
  const todayStr = getFormattedDate(today);

  const days = [];
  for (let i = -6; i <= 3; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = getFormattedDate(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayNumber = d.getDate();
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;

    days.push({
      dateStr,
      dayName,
      dayNumber,
      isToday,
      isSelected,
    });
  }

  return (
    <View className="py-2.5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {days.map((day) => {
          return (
            <Pressable
              key={day.dateStr}
              className={`w-[46px] h-[68px] rounded-2xl items-center justify-center py-2 border active:scale-95 transition-transform ${
                day.isSelected
                  ? 'bg-textPrimary border-textPrimary'
                  : 'bg-surface border-border'
              }`}
              onPress={() => onSelectDate(day.dateStr)}
            >
              <Text
                className={`text-[11px] mb-1 font-semibold ${
                  day.isSelected
                    ? 'text-background font-bold'
                    : day.isToday
                    ? 'text-catHealth'
                    : 'text-textMuted'
                }`}
              >
                {day.dayName}
              </Text>

              <View
                className={`w-7 h-7 rounded-full items-center justify-center ${
                  day.isSelected ? 'bg-background' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    day.isSelected ? 'text-textPrimary' : 'text-textPrimary'
                  }`}
                >
                  {day.dayNumber}
                </Text>
              </View>

              {day.isToday && !day.isSelected && (
                <View className="w-1 h-1 rounded-full bg-catHealth mt-0.5" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
