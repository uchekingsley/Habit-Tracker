# Habit Tracker

A sleek, minimalist, offline-first mobile habit tracker built with **React Native**, **Expo Router**, **Zustand**, and **Tailwind CSS (NativeWind v4)**. Designed with an obsidian dark aesthetic to help users cultivate daily routines, track continuous streaks, and visualize their productivity.

---

## Features

- **File-Based Routing**: Native deep-linking and modular layouts powered by **Expo Router**.
- **Atomic Global State**: Lightning-fast, zero-boilerplate state management with **Zustand** store selectors.
- **Utility-First Styling**: Seamless dark theme and responsive UI tokens powered by **Tailwind CSS / NativeWind v4**.
- **Daily Habit Tracking**: Toggle habits complete or incomplete with responsive haptic feedback (`expo-haptics`).
- **Interactive Weekly Date Strip**: Navigate across a multi-day window to log progress or review past performance.
- **Streaks & Retention**: Automated calculation of consecutive day streaks and all-time personal best streaks.
- **Analytics & Visual Reports**: Live completion rate for the active day, category breakdown, and a ranked streak leaderboard.
- **Custom Local Reminders**: Schedule daily push notifications at custom times using `expo-notifications`.
- **Offline-First Storage**: Local persistence using `@react-native-async-storage/async-storage` with schema validation and automatic data recovery.

---

## How to Use the App

The app is organized into three intuitive screens accessible via the bottom navigation tabs:

### 1. Today Screen (`Today` tab)
- **Log Daily Completions**: Tap the circular checkbox on any habit card to toggle it done/undone. A tactile vibration (`expo-haptics`) confirms the action.
- **Navigate Dates**: Scroll the horizontal calendar date strip to view or backfill habits for past days or preview future days.
- **Monitor Daily Progress**: The top header pill dynamically calculates your completion rate (e.g., `3/4 · 75%`).
- **Create New Habits**: Tap the floating `+` button in the bottom right corner:
  1. Enter a habit title (e.g. *Drink 2.5L Water*, *Read 20 pages*).
  2. Select a category tag (*Health*, *Fitness*, *Learning*, *Career*, or *Mindfulness*).
  3. Choose an optional daily reminder time (e.g. *08:30 AM*, *09:00 PM*).
  4. Tap **Create Habit** to save and schedule its local notification.

### 2. Analytics Screen (`Analytics` tab)
- **Review Completion Stats**: Track daily completion percentage and all-time longest streak records.
- **Category Breakdown**: View visual progress bars showing how your habits are distributed across categories.
- **Streak Leaderboard**: See which habits have your highest consecutive daily streaks ranked in real time.

### 3. Settings Screen (`Settings` tab)
- **Manage Alerts & Haptics**: Turn push notifications and vibration feedback on or off.
- **Test Notifications**: Tap **Send Test Notification** to test system notification permissions and alerts.
- **Data Management**: Tap **Reset Habit Data** anytime to restore default sample habits.

---

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (SDK 57) / [React Native](https://reactnative.dev) (v0.86)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) / [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Hardware Integrations**:
  - `expo-notifications` (Scheduled push alerts)
  - `expo-haptics` (Tactile vibration feedback)
  - `expo-font` (Vector icons)
- **Storage**: `@react-native-async-storage/async-storage`

---

## Project Structure

```text
├── src/
│   ├── app/                   # Expo Router file-based routes
│   │   ├── _layout.tsx        # Root layout (Zustand init, CSS injection, Stack)
│   │   └── (tabs)/            # Bottom tab navigator group
│   │       ├── _layout.tsx    # Tab navigation bar configuration
│   │       ├── index.tsx      # Today screen (Habits checklist & DateStrip)
│   │       ├── analytics.tsx  # Analytics & streak leaderboard
│   │       └── settings.tsx   # Push notification & data settings
│   ├── components/            # Reusable UI components (Tailwind-styled)
│   │   ├── AddHabitModal.tsx  # Habit creation modal
│   │   ├── DateStrip.tsx      # Horizontal sliding calendar date picker
│   │   ├── HabitCard.tsx      # Habit item card with haptic checkbox
│   │   └── Header.tsx         # Top bar with progress indicator pill
│   ├── constants/
│   │   └── theme.ts           # Design tokens & color constants
│   ├── store/
│   │   └── habitStore.ts      # Zustand store (state, actions & selectors)
│   ├── types/
│   │   └── habit.ts           # Habit interfaces & streak calculation utils
│   └── utils/
│       ├── notifications.ts   # Expo notification scheduling helpers
│       └── storage.ts         # AsyncStorage load/save routines
├── global.css                 # Tailwind CSS entry file
├── tailwind.config.js         # Tailwind configuration & custom palette
├── metro.config.js            # Metro configuration with NativeWind
├── babel.config.js            # Babel preset for NativeWind JSX
├── app.json                   # Expo application configuration & plugins
└── package.json               # Dependencies and build scripts
```

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Habit-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

### Running on a Device / Emulator

- **Physical Device**: Download the **Expo Go** app on iOS or Android, then scan the QR code displayed in the terminal.
- **Android Emulator**: Press `a` in the terminal with an active emulator running.
- **iOS Simulator**: Press `i` in the terminal (macOS only).
- **Web Preview**: Press `w` in the terminal to run in a web browser.

---

## Development Checks

To verify type safety and code quality:

```bash
# Run TypeScript compilation check
npx tsc --noEmit
```

---

## License

This project is licensed under the [MIT License](LICENSE).

