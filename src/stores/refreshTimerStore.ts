import { atom } from 'nanostores';

// Refresh interval: 5 hours in milliseconds
export const REFRESH_INTERVAL = 5 * 60 * 60 * 1000; // 5 hours

interface RefreshTimerState {
  nextRefreshTime: number;
  timeUntilRefresh: number;
  isRefreshing: boolean;
}

export const refreshTimerStore = atom<RefreshTimerState>({
  nextRefreshTime: Date.now() + REFRESH_INTERVAL,
  timeUntilRefresh: REFRESH_INTERVAL,
  isRefreshing: false,
});

// Format milliseconds to human-readable countdown
export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Refreshing...';

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Update countdown every second
let countdownInterval: NodeJS.Timeout | null = null;

export function startCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    const state = refreshTimerStore.get();
    const now = Date.now();
    const timeUntilRefresh = Math.max(0, state.nextRefreshTime - now);

    refreshTimerStore.set({
      ...state,
      timeUntilRefresh,
    });
  }, 1000);
}

export function resetRefreshTimer() {
  const nextRefreshTime = Date.now() + REFRESH_INTERVAL;

  refreshTimerStore.set({
    nextRefreshTime,
    timeUntilRefresh: REFRESH_INTERVAL,
    isRefreshing: false,
  });

  // Save to localStorage for persistence across page reloads
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('vf_next_refresh', nextRefreshTime.toString());
    } catch (e) {
      console.error('Failed to save refresh timer to localStorage', e);
    }
  }
}

export function setRefreshing(isRefreshing: boolean) {
  const state = refreshTimerStore.get();
  refreshTimerStore.set({
    ...state,
    isRefreshing,
  });
}

// Load from localStorage on initialization
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    const saved = localStorage.getItem('vf_next_refresh');
    if (saved) {
      const nextRefreshTime = parseInt(saved, 10);
      const now = Date.now();
      const timeUntilRefresh = Math.max(0, nextRefreshTime - now);

      // If the saved time is in the past or more than 5 hours in the future, reset it
      if (timeUntilRefresh === 0 || timeUntilRefresh > REFRESH_INTERVAL) {
        resetRefreshTimer();
      } else {
        refreshTimerStore.set({
          nextRefreshTime,
          timeUntilRefresh,
          isRefreshing: false,
        });
      }
    } else {
      resetRefreshTimer();
    }
  } catch (e) {
    console.error('Failed to load refresh timer from localStorage', e);
    resetRefreshTimer();
  }
} else {
  // Not in browser, set default
  resetRefreshTimer();
}

// Start the countdown when the module loads
if (typeof window !== 'undefined') {
  startCountdown();
}
