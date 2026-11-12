import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from '../components/HabitCard';
import { Header } from '../components/Header';
import { DateStrip } from '../components/DateStrip';
import { AddHabitModal } from '../components/AddHabitModal';
import { colors } from '../constants/theme';
import { getFormattedDate } from '../types/habit';

export const TodayScreen: React.FC = () => {
  const {
    habits,
    isLoading,
    selectedDate,
    setSelectedDate,
    toggleHabit,
    addHabit,
    deleteHabit,
    completedCountOnDate,
    totalCount,
  } = useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format header subtitle based on selected date
  const isToday = selectedDate === getFormattedDate();
  const [year, month, day] = selectedDate.split('-').map(Number);
  const activeDateObj = new Date(year, month - 1, day);
  const formattedSubtitle = activeDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Top Header */}
      <Header
        subtitle={isToday ? `Today · ${formattedSubtitle}` : formattedSubtitle}
        title="Habits"
        completedCount={completedCountOnDate}
        totalCount={totalCount}
      />

      {/* Horizontal Weekly Date Strip */}
      <DateStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
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
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No habits found. Tap + to create one.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setIsModalOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Add new habit"
      >
        <Ionicons name="add" size={26} color={colors.background} />
      </Pressable>

      {/* Modal */}
      <AddHabitModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 110,
    paddingTop: 6,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabPressed: {
    transform: [{ scale: 0.93 }],
    opacity: 0.85,
  },
});
