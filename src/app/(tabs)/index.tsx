import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../store/habitStore';
import { HabitCard } from '../../components/HabitCard';
import { Header } from '../../components/Header';
import { DateStrip } from '../../components/DateStrip';
import { AddHabitModal } from '../../components/AddHabitModal';
import { colors } from '../../constants/theme';
import { getFormattedDate } from '../../types/habit';

export default function TodayScreen() {
  const habits = useHabitStore((state) => state.habits);
  const isLoading = useHabitStore((state) => state.isLoading);
  const selectedDate = useHabitStore((state) => state.selectedDate);
  const setSelectedDate = useHabitStore((state) => state.setSelectedDate);
  const toggleHabit = useHabitStore((state) => state.toggleHabit);
  const addHabit = useHabitStore((state) => state.addHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  const completedCountOnDate = useHabitStore((state) =>
    state.getCompletedCountOnDate(state.selectedDate)
  );
  const totalCount = useHabitStore((state) => state.getTotalCount());

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isToday = selectedDate === getFormattedDate();
  const [year, month, day] = selectedDate.split('-').map(Number);
  const activeDateObj = new Date(year, month - 1, day);
  const formattedSubtitle = activeDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Header
        subtitle={isToday ? `Today · ${formattedSubtitle}` : formattedSubtitle}
        title="Habits"
        completedCount={completedCountOnDate}
        totalCount={totalCount}
      />

      <DateStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.textSecondary} />
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              selectedDate={selectedDate}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          )}
          contentContainerStyle={{ paddingBottom: 110, paddingTop: 6 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="p-10 items-center">
              <Text className="text-textMuted text-sm">
                No habits found. Tap + to create one.
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <Pressable
        className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-textPrimary items-center justify-center shadow-lg active:scale-95 transition-transform"
        onPress={() => setIsModalOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Add new habit"
      >
        <Ionicons name="add" size={26} color={colors.background} />
      </Pressable>

      <AddHabitModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </SafeAreaView>
  );
}

