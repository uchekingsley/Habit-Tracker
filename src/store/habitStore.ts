import { create } from 'zustand';
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

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  selectedDate: string;
  
  // Actions
  initialize: () => Promise<void>;
  setSelectedDate: (date: string) => void;
  toggleHabit: (id: string, dateStr?: string) => Promise<void>;
  addHabit: (habitData: Omit<Habit, 'id' | 'history' | 'createdAt'>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  resetAllHabits: () => Promise<void>;

  // Selectors / derived
  getCompletedCountOnDate: (dateStr?: string) => number;
  getTotalCount: () => number;
  getCompletionRateOnDate: (dateStr?: string) => number;
  getLongestStreak: () => number;
}

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
    history: generatePastHistory([1, 2, 3, 4, 5]),
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
    history: generatePastHistory([0, 1, 2, 3, 4, 5, 6, 7]),
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

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: true,
  selectedDate: getFormattedDate(),

  initialize: async () => {
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

      set({ habits: sanitized, isLoading: false });
      await saveHabits(sanitized);
    } else {
      set({ habits: INITIAL_HABITS, isLoading: false });
      await saveHabits(INITIAL_HABITS);
    }
  },

  setSelectedDate: (date: string) => set({ selectedDate: date }),

  toggleHabit: async (id: string, dateStr?: string) => {
    const targetDate = dateStr || get().selectedDate;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const updated = get().habits.map((habit) => {
      if (habit.id === id) {
        const safeHistory = habit.history || {};
        const isCurrentlyCompleted = !!safeHistory[targetDate];
        const newHistory = { ...safeHistory };

        if (isCurrentlyCompleted) {
          delete newHistory[targetDate];
        } else {
          newHistory[targetDate] = true;
        }

        return {
          ...habit,
          history: newHistory,
        };
      }
      return habit;
    });

    set({ habits: updated });
    saveHabits(updated);
  },

  addHabit: async (habitData) => {
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

    const updated = [newHabit, ...get().habits];
    set({ habits: updated });
    saveHabits(updated);
  },

  deleteHabit: async (id: string) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const habitToDelete = get().habits.find((h) => h.id === id);
    if (habitToDelete?.notificationId) {
      await cancelHabitReminder(habitToDelete.notificationId);
    }

    const updated = get().habits.filter((h) => h.id !== id);
    set({ habits: updated });
    saveHabits(updated);
  },

  resetAllHabits: async () => {
    set({ habits: INITIAL_HABITS });
    await saveHabits(INITIAL_HABITS);
  },

  getCompletedCountOnDate: (dateStr?: string) => {
    const target = dateStr || get().selectedDate;
    return get().habits.filter((h) => !!(h.history && h.history[target])).length;
  },

  getTotalCount: () => get().habits.length,

  getCompletionRateOnDate: (dateStr?: string) => {
    const total = get().getTotalCount();
    if (total === 0) return 0;
    const completed = get().getCompletedCountOnDate(dateStr);
    return Math.round((completed / total) * 100);
  },

  getLongestStreak: () => {
    return get().habits.reduce(
      (max, h) => Math.max(max, calculateBestStreak(h.history || {})),
      0
    );
  },
}));

