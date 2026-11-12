import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { Habit, getFormattedDate } from '../types/habit';

interface WeeklyBarChartProps {
  habits: Habit[];
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ habits }) => {
  const today = new Date();
  const todayStr = getFormattedDate(today);

  // Find Monday of the current week
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Mon...
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + distanceToMonday);

  const weekDays = [];
  const totalHabits = habits.length;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = getFormattedDate(d);
    const label = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const isToday = dateStr === todayStr;

    const completed = habits.filter(
      (h) => h.history && !!h.history[dateStr]
    ).length;

    const percentage = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;

    weekDays.push({
      dateStr,
      label,
      isToday,
      percentage,
      completed,
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>THIS WEEK'S ACTIVITY</Text>
        <Text style={styles.cardSubtitle}>Mon – Sun</Text>
      </View>

      <View style={styles.chartContainer}>
        {weekDays.map((day) => {
          const barHeightPercentage = Math.max(8, day.percentage); // minimum visible nub

          return (
            <View key={day.dateStr} style={styles.barColumn}>
              {/* Bar percentage label */}
              <Text style={styles.barPercentage}>
                {day.percentage > 0 ? `${day.percentage}%` : ''}
              </Text>

              {/* Bar track and fill */}
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { height: `${barHeightPercentage}%` },
                    day.percentage === 100 && styles.fillPerfect,
                    day.isToday && styles.fillToday,
                  ]}
                />
              </View>

              {/* Day letter */}
              <Text style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}>
                {day.label}
              </Text>

              {day.isToday && <View style={styles.todayIndicator} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barPercentage: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  track: {
    width: 14,
    height: 90,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    backgroundColor: colors.textSecondary,
    borderRadius: 7,
  },
  fillPerfect: {
    backgroundColor: colors.categories.fitness, // 100% green
  },
  fillToday: {
    backgroundColor: colors.textPrimary, // Clean white highlight for today
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 6,
  },
  dayLabelToday: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  todayIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textPrimary,
    marginTop: 2,
  },
});
