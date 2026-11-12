import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { colors } from '../constants/theme';
import { Habit, getFormattedDate } from '../types/habit';

interface HeatmapGridProps {
  habits: Habit[];
  daysCount?: number; // default 70 days (~10 weeks)
}

interface DayCell {
  dateStr: string;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  completedCount: number;
  totalCount: number;
  intensity: number; // 0 to 4
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ habits, daysCount = 70 }) => {
  const [selectedDay, setSelectedDay] = useState<DayCell | null>(null);

  // Generate matrix of days
  const today = new Date();
  const totalHabits = habits.length;

  // Build list of all dates in window
  const cells: DayCell[] = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = getFormattedDate(d);
    const dayOfWeek = d.getDay(); // 0 is Sunday

    // Count completions for this day
    const completedCount = habits.filter(
      (h) => h.history && !!h.history[dateStr]
    ).length;

    const rate = totalHabits > 0 ? completedCount / totalHabits : 0;
    
    // Intensity bucket from 0 to 4
    let intensity = 0;
    if (completedCount > 0) {
      if (rate >= 1) intensity = 4;        // 100%
      else if (rate >= 0.66) intensity = 3; // 66%-99%
      else if (rate >= 0.33) intensity = 2; // 33%-65%
      else intensity = 1;                   // 1%-32%
    }

    cells.push({
      dateStr,
      dayOfWeek,
      completedCount,
      totalCount: totalHabits,
      intensity,
    });
  }

  // Group into columns of 7 days (weeks)
  const columns: DayCell[][] = [];
  let currentColumn: DayCell[] = [];

  cells.forEach((cell) => {
    currentColumn.push(cell);
    if (cell.dayOfWeek === 6 || currentColumn.length === 7) {
      columns.push(currentColumn);
      currentColumn = [];
    }
  });
  if (currentColumn.length > 0) {
    columns.push(currentColumn);
  }

  // Intensity color mapper
  const getCellColor = (intensity: number): string => {
    switch (intensity) {
      case 4:
        return '#22c55e'; // Vibrant Emerald (100%)
      case 3:
        return '#16a34a'; // Deep Green (66%+)
      case 2:
        return '#15803d'; // Medium Forest (33%+)
      case 1:
        return '#14532d'; // Dark Moss (1%+)
      default:
        return colors.surfaceSubtle; // Empty (#27272a)
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>CONSISTENCY HEATMAP</Text>
        <Text style={styles.cardSubtitle}>Last {daysCount} Days</Text>
      </View>

      {/* Horizontal scrolling grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
      >
        {/* Day-of-week labels column */}
        <View style={styles.labelsColumn}>
          <Text style={styles.dayLabel}>M</Text>
          <Text style={styles.dayLabel}>W</Text>
          <Text style={styles.dayLabel}>F</Text>
          <Text style={styles.dayLabel}>S</Text>
        </View>

        {/* Matrix columns */}
        {columns.map((col, colIdx) => (
          <View key={colIdx} style={styles.weekColumn}>
            {col.map((cell) => (
              <Pressable
                key={cell.dateStr}
                style={[
                  styles.cell,
                  { backgroundColor: getCellColor(cell.intensity) },
                  selectedDay?.dateStr === cell.dateStr && styles.selectedCell,
                ]}
                onPress={() => setSelectedDay(cell)}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Selected day inspection banner */}
      {selectedDay ? (
        <View style={styles.tooltipBanner}>
          <Text style={styles.tooltipDate}>{selectedDay.dateStr}</Text>
          <Text style={styles.tooltipDetails}>
            {selectedDay.completedCount} of {selectedDay.totalCount} completed (
            {selectedDay.totalCount > 0
              ? Math.round((selectedDay.completedCount / selectedDay.totalCount) * 100)
              : 0}
            %)
          </Text>
        </View>
      ) : (
        <View style={styles.legendRow}>
          <Text style={styles.legendText}>Less</Text>
          <View style={[styles.legendCell, { backgroundColor: colors.surfaceSubtle }]} />
          <View style={[styles.legendCell, { backgroundColor: '#14532d' }]} />
          <View style={[styles.legendCell, { backgroundColor: '#15803d' }]} />
          <View style={[styles.legendCell, { backgroundColor: '#16a34a' }]} />
          <View style={[styles.legendCell, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.legendText}>More</Text>
        </View>
      )}
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
    marginBottom: 14,
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
  gridContent: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  labelsColumn: {
    justifyContent: 'space-between',
    paddingVertical: 2,
    marginRight: 8,
    height: 104,
  },
  dayLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
  },
  weekColumn: {
    flexDirection: 'column',
    gap: 4,
    marginRight: 4,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  selectedCell: {
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 10,
  },
  legendText: {
    fontSize: 10,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  tooltipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  tooltipDate: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tooltipDetails: {
    fontSize: 12,
    color: colors.categories.fitness,
    fontWeight: '600',
  },
});
