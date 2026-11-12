import React from 'react';
import { Text, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle: string;
  completedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  completedCount,
  totalCount,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View className="px-5 pt-4 pb-5 flex-row items-center justify-between">
      <View>
        <Text className="text-[11px] text-textMuted uppercase font-semibold tracking-widest">
          {subtitle}
        </Text>
        <Text className="text-[26px] font-bold text-textPrimary mt-1 tracking-tight">
          {title}
        </Text>
      </View>

      {/* Minimalist Progress Pill */}
      <View className="flex-row items-center bg-surfaceSubtle border border-border px-3 py-1.5 rounded-full">
        <View
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            percentage === 100 ? 'bg-catFitness' : 'bg-textSecondary'
          }`}
        />
        <Text className="text-zinc-200 font-semibold text-xs">
          {completedCount}/{totalCount} · {percentage}%
        </Text>
      </View>
    </View>
  );
};
