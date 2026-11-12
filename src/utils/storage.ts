import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/habit';

const HABITS_STORAGE_KEY = '@habit_tracker_habits_v1';

/**
 * Load saved habits from persistent storage.
 * Returns null if no data has ever been saved yet.
 */
export const loadHabits = async (): Promise<Habit[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
    return jsonValue != null ? (JSON.parse(jsonValue) as Habit[]) : null;
  } catch (error) {
    console.error('Error loading habits from storage:', error);
    return null;
  }
};

/**
 * Save current habits array to persistent storage.
 */
export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(habits);
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving habits to storage:', error);
  }
};
