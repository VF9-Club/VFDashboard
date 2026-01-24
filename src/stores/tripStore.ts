import { atom, computed } from "nanostores";
import { api } from "../services/api";

// Types
export interface Trip {
  id: string;
  date: Date | null;
  startLocation: string;
  endLocation: string;
  startCoords: { lat: number; lng: number };
  endCoords: { lat: number; lng: number };
  distance: number;
  duration: number;
  energyConsumed: number;
  avgSpeed: number;
  maxSpeed: number;
  startSoc: number;
  endSoc: number;
  efficiency: number;
}

export interface TripState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  lastFetched: number | null;

  // Stats
  totalDistance: number;
  totalEnergy: number;
  avgEfficiency: number;
  tripCount: number;
}

// Initial state
const initialState: TripState = {
  trips: [],
  loading: false,
  error: null,
  total: 0,
  page: 0,
  lastFetched: null,

  totalDistance: 0,
  totalEnergy: 0,
  avgEfficiency: 0,
  tripCount: 0,
};

// Store
export const tripStore = atom<TripState>(initialState);

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Actions

/**
 * Fetch trip history
 */
export async function fetchTrips(
  from: string | null = null,
  to: string | null = null,
  page = 0,
  forceRefresh = false
) {
  const state = tripStore.get();

  // Check cache (only for first page)
  if (
    !forceRefresh &&
    page === 0 &&
    state.lastFetched &&
    Date.now() - state.lastFetched < CACHE_DURATION &&
    state.trips.length > 0
  ) {
    return state.trips;
  }

  tripStore.set({
    ...state,
    loading: true,
    error: null,
  });

  try {
    const result = await api.getTripHistory(from, to, page, 20);

    // Calculate stats
    const trips = page === 0 ? result.trips : [...state.trips, ...result.trips];
    const totalDistance = trips.reduce((sum, t) => sum + (t.distance || 0), 0);
    const totalEnergy = trips.reduce((sum, t) => sum + (t.energyConsumed || 0), 0);
    const avgEfficiency = totalDistance > 0 ? Math.round((totalEnergy * 1000) / totalDistance) : 0;

    tripStore.set({
      ...tripStore.get(),
      trips,
      loading: false,
      total: result.total,
      page,
      lastFetched: Date.now(),
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalEnergy: Math.round(totalEnergy * 10) / 10,
      avgEfficiency,
      tripCount: trips.length,
    });

    return trips;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch trips";
    tripStore.set({
      ...tripStore.get(),
      loading: false,
      error: message,
    });
    return [];
  }
}

/**
 * Load more trips (pagination)
 */
export async function loadMoreTrips() {
  const state = tripStore.get();
  if (state.loading) return;
  if (state.trips.length >= state.total) return;

  await fetchTrips(null, null, state.page + 1);
}

/**
 * Reset trip store
 */
export function resetTripStore() {
  tripStore.set(initialState);
}

// Computed values
export const hasMoreTrips = computed(tripStore, (state) => {
  return state.trips.length < state.total;
});

export const recentTrips = computed(tripStore, (state) => {
  return state.trips.slice(0, 5);
});

// Calculate driving score based on efficiency
export const drivingScore = computed(tripStore, (state) => {
  if (state.trips.length === 0) return 0;

  // Base score starts at 70
  let score = 70;

  // Efficiency bonus (lower is better)
  // Reference: 250 Wh/km is average
  if (state.avgEfficiency > 0) {
    if (state.avgEfficiency < 200) score += 25;
    else if (state.avgEfficiency < 220) score += 20;
    else if (state.avgEfficiency < 240) score += 15;
    else if (state.avgEfficiency < 260) score += 10;
    else if (state.avgEfficiency < 280) score += 5;
  }

  // Trip count bonus (more trips = more data = more reliable)
  if (state.tripCount >= 10) score += 5;

  return Math.min(100, Math.max(0, score));
});
