export type HabitType = 'boolean' | 'numeric' | 'timer';

export interface Habit {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  type?: HabitType;
  targetCount?: number;          // e.g. 2500 for ml, 20 for pages
  unit?: string;                 // e.g. "ml", "pages", "mins"
  
  // Date-indexed completion history: { "2026-09-24": true, "2026-09-25": true }
  history: Record<string, boolean>;
  createdAt: string;             // ISO date string
  reminderTime?: string;         // e.g. "08:00", "20:30"
  notificationId?: string;       // OS notification identifier
}

/**
 * Format a Date object to YYYY-MM-DD
 */
export const getFormattedDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate current consecutive streak ending today or yesterday
 */
export const calculateCurrentStreak = (history?: Record<string, boolean>): number => {
  const safeHistory = history || {};
  let streak = 0;
  const today = new Date();
  
  // Start checking from today
  const checkDate = new Date(today);
  const todayStr = getFormattedDate(checkDate);

  // If not completed today, check if completed yesterday to maintain streak
  if (!safeHistory[todayStr]) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = getFormattedDate(checkDate);
    if (safeHistory[dateStr]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculate all-time longest streak in history
 */
export const calculateBestStreak = (history?: Record<string, boolean>): number => {
  const safeHistory = history || {};
  const dates = Object.keys(safeHistory)
    .filter((d) => safeHistory[d])
    .sort();

  if (dates.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const dateStr of dates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

    if (!lastDate) {
      currentStreak = 1;
    } else {
      const diffDays = Math.round(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    lastDate = currentDate;
  }

  return maxStreak;
};
