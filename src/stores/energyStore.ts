import { atom, computed } from "nanostores";
import { api } from "../services/api";

// Types
export interface DailyEnergy {
  date: string;
  consumed: number;
  charged: number;
}

export interface EnergyState {
  // Data
  totalConsumed: number;
  totalCharged: number;
  totalDistance: number;
  avgEfficiency: number;
  co2Saved: number;
  tripCount: number;
  sessionCount: number;
  daily: DailyEnergy[];

  // UI State
  period: "week" | "month";
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Initial state
const initialState: EnergyState = {
  totalConsumed: 0,
  totalCharged: 0,
  totalDistance: 0,
  avgEfficiency: 0,
  co2Saved: 0,
  tripCount: 0,
  sessionCount: 0,
  daily: [],

  period: "week",
  loading: false,
  error: null,
  lastFetched: null,
};

// Store
export const energyStore = atom<EnergyState>(initialState);

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Actions

/**
 * Fetch energy statistics
 */
export async function fetchEnergyStats(
  period: "week" | "month" = "week",
  forceRefresh = false
) {
  const state = energyStore.get();

  // Check cache
  if (
    !forceRefresh &&
    state.period === period &&
    state.lastFetched &&
    Date.now() - state.lastFetched < CACHE_DURATION &&
    state.daily.length > 0
  ) {
    return;
  }

  energyStore.set({
    ...state,
    period,
    loading: true,
    error: null,
  });

  try {
    const stats = await api.getEnergyStats(period);

    energyStore.set({
      ...energyStore.get(),
      ...stats,
      period,
      loading: false,
      lastFetched: Date.now(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch energy stats";
    energyStore.set({
      ...energyStore.get(),
      loading: false,
      error: message,
    });
  }
}

/**
 * Set period and fetch data
 */
export async function setPeriod(period: "week" | "month") {
  await fetchEnergyStats(period, true);
}

/**
 * Reset energy store
 */
export function resetEnergyStore() {
  energyStore.set(initialState);
}

// Computed values
export const efficiencyRating = computed(energyStore, (state) => {
  if (state.avgEfficiency === 0) return "unknown";
  if (state.avgEfficiency < 200) return "excellent";
  if (state.avgEfficiency < 230) return "good";
  if (state.avgEfficiency < 260) return "average";
  return "needs_improvement";
});

export const netEnergy = computed(energyStore, (state) => {
  return state.totalCharged - state.totalConsumed;
});

// Calculate estimated cost (using Vietnam electricity rates)
export const estimatedCost = computed(energyStore, (state) => {
  // Average home charging rate: ~2,500 VND/kWh
  // Average public charging rate: ~3,000 VND/kWh
  // Assume 70% home, 30% public
  const homeRate = 2500;
  const publicRate = 3000;
  const avgRate = homeRate * 0.7 + publicRate * 0.3;

  return Math.round(state.totalCharged * avgRate);
});

// Calculate trees equivalent for CO2 saved
export const treesEquivalent = computed(energyStore, (state) => {
  // Average tree absorbs ~21 kg CO2 per year
  return Math.round(state.co2Saved / 21);
});
