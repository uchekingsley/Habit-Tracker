import React, { useState } from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { Habit } from '../types/habit';

export interface CategoryOption {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const CATEGORIES: CategoryOption[] = [
  { name: 'Health', icon: 'water-outline', color: colors.categories.health },
  { name: 'Fitness', icon: 'fitness-outline', color: colors.categories.fitness },
  { name: 'Learning', icon: 'book-outline', color: colors.categories.learning },
  { name: 'Career', icon: 'code-slash-outline', color: colors.categories.career },
  { name: 'Mindfulness', icon: 'leaf-outline', color: colors.categories.mindfulness },
];

const REMINDER_PRESETS = [
  { label: 'None', time: null },
  { label: '07:00 AM', time: '07:00' },
  { label: '08:30 AM', time: '08:30' },
  { label: '12:30 PM', time: '12:30' },
  { label: '06:00 PM', time: '18:00' },
  { label: '09:00 PM', time: '21:00' },
];

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'history' | 'createdAt'>) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>(CATEGORIES[0]);
  const [selectedReminder, setSelectedReminder] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      category: selectedCategory.name,
      icon: selectedCategory.icon,
      color: selectedCategory.color,
      reminderTime: selectedReminder || undefined,
    });

    setTitle('');
    setSelectedCategory(CATEGORIES[0]);
    setSelectedReminder(null);
    onClose();
  };

  const handleCancel = () => {
    setTitle('');
    setSelectedCategory(CATEGORIES[0]);
    setSelectedReminder(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/70 justify-end">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full"
          >
            <View className="bg-surface rounded-t-3xl border-t border-border px-5 pt-5 pb-8">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-xl font-bold text-textPrimary">New Habit</Text>
                <Pressable onPress={handleCancel} hitSlop={12}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </Pressable>
              </View>

              {/* Habit Name Input */}
              <Text className="text-[11px] font-bold text-textMuted tracking-wider mb-2">
                HABIT NAME
              </Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3.5 text-base text-textPrimary mb-4"
                placeholder="e.g. Read 15 mins, Meditate..."
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />

              {/* Category Picker */}
              <Text className="text-[11px] font-bold text-textMuted tracking-wider mb-2">
                CATEGORY
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.name === cat.name;
                  return (
                    <Pressable
                      key={cat.name}
                      className={`flex-row items-center rounded-full px-3.5 py-2 border ${
                        isSelected
                          ? 'bg-surfaceSubtle'
                          : 'bg-background border-border'
                      }`}
                      style={isSelected ? { borderColor: cat.color } : {}}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={15}
                        color={isSelected ? cat.color : colors.textSecondary}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        className={`text-xs ${
                          isSelected
                            ? 'text-textPrimary font-bold'
                            : 'text-textSecondary font-medium'
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Daily Reminder Preset Picker */}
              <Text className="text-[11px] font-bold text-textMuted tracking-wider mb-2">
                DAILY REMINDER ALERT
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingBottom: 20 }}
              >
                {REMINDER_PRESETS.map((preset) => {
                  const isSelected = selectedReminder === preset.time;
                  return (
                    <Pressable
                      key={preset.label}
                      className={`flex-row items-center rounded-full px-3.5 py-2 border ${
                        isSelected
                          ? 'border-textPrimary bg-surfaceSubtle'
                          : 'border-border bg-background'
                      }`}
                      onPress={() => setSelectedReminder(preset.time)}
                    >
                      <Ionicons
                        name={preset.time ? 'alarm-outline' : 'notifications-off-outline'}
                        size={14}
                        color={isSelected ? colors.textPrimary : colors.textSecondary}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        className={`text-xs ${
                          isSelected
                            ? 'text-textPrimary font-bold'
                            : 'text-textSecondary font-medium'
                        }`}
                      >
                        {preset.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Action Buttons */}
              <View className="flex-row gap-3 pt-2">
                <Pressable
                  className="flex-1 py-3.5 rounded-xl bg-surfaceSubtle items-center justify-center active:opacity-80"
                  onPress={handleCancel}
                >
                  <Text className="text-textSecondary font-semibold text-[15px]">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  className={`flex-1 py-3.5 rounded-xl bg-textPrimary items-center justify-center active:opacity-90 ${
                    !title.trim() ? 'opacity-40' : ''
                  }`}
                  onPress={handleSubmit}
                  disabled={!title.trim()}
                >
                  <Text className="text-background font-bold text-[15px]">
                    Create Habit
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
