import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import {
  Habit,
  getFormattedDate,
  calculateCurrentStreak,
  calculateBestStreak,
} from '../types/habit';
import { loadHabits, saveHabits } from '../utils/storage';
import { scheduleHabitReminder, cancelHabitReminder } from '../utils/notifications';
import { colors } from '../constants/theme';

interface HabitContextType {
  habits: Habit[];
  isLoading: boolean;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  toggleHabit: (id: string, dateStr?: string) => Promise<void>;
  addHabit: (habitData: Omit<Habit, 'id' | 'history' | 'createdAt'>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  resetAllHabits: () => Promise<void>;
  completedCountOnDate: number;
  totalCount: number;
  completionRateOnDate: number;
  longestStreak: number;
}

// Helper to generate sample history for the past N days
const generatePastHistory = (daysAgoList: number[]): Record<string, boolean> => {
  const history: Record<string, boolean> = {};
  const today = new Date();
  
  daysAgoList.forEach((offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    history[getFormattedDate(d)] = true;
  });

  return history;
};

const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Drink 2.5L Water',
    category: 'Health',
    icon: 'water-outline',
    color: colors.categories.health,
    type: 'boolean',
    reminderTime: '08:30',
    history: generatePastHistory([1, 2, 3, 4, 5]), // 5-day streak
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Read 20 pages',
    category: 'Learning',
    icon: 'book-outline',
    color: colors.categories.learning,
    type: 'boolean',
    reminderTime: '21:00',
    history: generatePastHistory([0, 1, 2, 3, 4, 5, 6, 7]), // completed today + streak
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '30m Workout',
    category: 'Fitness',
    icon: 'fitness-outline',
    color: colors.categories.fitness,
    type: 'boolean',
    history: generatePastHistory([1, 2, 4]),
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Practice React Native',
    category: 'Career',
    icon: 'code-slash-outline',
    color: colors.categories.career,
    type: 'boolean',
    history: generatePastHistory([0, 1]),
    createdAt: new Date().toISOString(),
  },
];

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate());

  // 1. Initial load from storage on app start with schema migration sanitizer
  useEffect(() => {
    const initialize = async () => {
      const stored = await loadHabits();
      if (stored && stored.length > 0) {
        const sanitized: Habit[] = stored.map((h: any) => ({
          id: h.id || Date.now().toString(),
          title: h.title || 'Untitled Habit',
          category: h.category || 'General',
          icon: h.icon || 'checkbox-outline',
          color: h.color || colors.textPrimary,
          type: h.type || 'boolean',
          reminderTime: h.reminderTime,
          notificationId: h.notificationId,
          history: h.history || (h.completedToday ? { [getFormattedDate()]: true } : {}),
          createdAt: h.createdAt || new Date().toISOString(),
        }));

        setHabits(sanitized);
        await saveHabits(sanitized);
      } else {
        setHabits(INITIAL_HABITS);
        await saveHabits(INITIAL_HABITS);
      }
      setIsLoading(false);
    };

    initialize();
  }, []);

  const updateAndSave = (updated: Habit[]) => {
    setHabits(updated);
    saveHabits(updated);
  };

  // Toggle habit on a specific date (defaults to selectedDate)
  const toggleHabit = async (id: string, dateStr?: string) => {
    const targetDate = dateStr || selectedDate;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const updated = habits.map((habit) => {
      if (habit.id === id) {
        const safeHistory = habit.history || {};
        const isCurrentlyCompleted = !!safeHistory[targetDate];
        const newHistory = { ...safeHistory };

        if (isCurrentlyCompleted) {
          delete newHistory[targetDate]; // uncheck
        } else {
          newHistory[targetDate] = true; // check
        }

        return {
          ...habit,
          history: newHistory,
        };
      }
      return habit;
    });

    updateAndSave(updated);
  };

  // Add new habit and schedule reminder if selected
  const addHabit = async (
    habitData: Omit<Habit, 'id' | 'history' | 'createdAt'>
  ) => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    const id = Date.now().toString();
    let notificationId: string | undefined = undefined;

    if (habitData.reminderTime) {
      const [hours, minutes] = habitData.reminderTime.split(':').map(Number);
      const scheduledId = await scheduleHabitReminder(id, habitData.title, hours, minutes);
      if (scheduledId) {
        notificationId = scheduledId;
      }
    }

    const newHabit: Habit = {
      ...habitData,
      id,
      notificationId,
      history: {},
      createdAt: new Date().toISOString(),
    };

    const updated = [newHabit, ...habits];
    updateAndSave(updated);
  };

  // Delete habit and cancel its notification
  const deleteHabit = async (id: string) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const habitToDelete = habits.find((h) => h.id === id);
    if (habitToDelete?.notificationId) {
      await cancelHabitReminder(habitToDelete.notificationId);
    }

    const updated = habits.filter((h) => h.id !== id);
    updateAndSave(updated);
  };

  // Reset to initial starter data
  const resetAllHabits = async () => {
    updateAndSave(INITIAL_HABITS);
  };

  // Safe calculations relative to selectedDate
  const completedCountOnDate = habits.filter((h) => !!(h.history && h.history[selectedDate])).length;
  const totalCount = habits.length;
  const completionRateOnDate =
    totalCount > 0 ? Math.round((completedCountOnDate / totalCount) * 100) : 0;
  
  const longestStreak = habits.reduce(
    (max, h) => Math.max(max, calculateBestStreak(h.history || {})),
    0
  );

  return (
    <HabitContext.Provider
      value={{
        habits,
        isLoading,
        selectedDate,
        setSelectedDate,
        toggleHabit,
        addHabit,
        deleteHabit,
        resetAllHabits,
        completedCountOnDate,
        totalCount,
        completionRateOnDate,
        longestStreak,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
