import { atom, computed } from "nanostores";
import { api } from "../services/api";

// Types
export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  totalConnectors: number;
  availableConnectors: number;
  connectorTypes: string[];
  maxPower: number;
  status: "available" | "busy" | "offline";
  operatingHours?: string;
  amenities?: string[];
}

export interface ChargingSession {
  id: string;
  stationName: string;
  stationAddress: string;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
  startSoc: number;
  endSoc: number;
  kWh: number;
  cost: number;
  currency: string;
  connectorType: string;
  maxPower: number;
  duration: number;
}

export interface ChargingState {
  // Stations
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  stationsLoading: boolean;
  stationsError: string | null;
  stationsLastFetched: number | null;

  // Sessions
  sessions: ChargingSession[];
  sessionsLoading: boolean;
  sessionsError: string | null;
  sessionsTotal: number;
  sessionsPage: number;
  sessionsLastFetched: number | null;

  // Stats
  totalKwh: number;
  totalCost: number;
  sessionCount: number;
  avgCostPerKwh: number;
}

// Initial state
const initialState: ChargingState = {
  stations: [],
  selectedStation: null,
  stationsLoading: false,
  stationsError: null,
  stationsLastFetched: null,

  sessions: [],
  sessionsLoading: false,
  sessionsError: null,
  sessionsTotal: 0,
  sessionsPage: 0,
  sessionsLastFetched: null,

  totalKwh: 0,
  totalCost: 0,
  sessionCount: 0,
  avgCostPerKwh: 0,
};

// Store
export const chargingStore = atom<ChargingState>(initialState);

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Actions

/**
 * Fetch nearby charging stations
 */
export async function fetchChargingStations(
  latitude: number,
  longitude: number,
  forceRefresh = false
) {
  const state = chargingStore.get();

  // Check cache
  if (
    !forceRefresh &&
    state.stationsLastFetched &&
    Date.now() - state.stationsLastFetched < CACHE_DURATION &&
    state.stations.length > 0
  ) {
    return state.stations;
  }

  chargingStore.set({
    ...state,
    stationsLoading: true,
    stationsError: null,
  });

  try {
    const stations = await api.searchChargingStations(latitude, longitude);

    chargingStore.set({
      ...chargingStore.get(),
      stations,
      stationsLoading: false,
      stationsLastFetched: Date.now(),
    });

    return stations;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch stations";
    chargingStore.set({
      ...chargingStore.get(),
      stationsLoading: false,
      stationsError: message,
    });
    return [];
  }
}

/**
 * Select a charging station
 */
export function selectStation(station: ChargingStation | null) {
  chargingStore.set({
    ...chargingStore.get(),
    selectedStation: station,
  });
}

/**
 * Fetch charging sessions history
 */
export async function fetchChargingSessions(page = 0, forceRefresh = false) {
  const state = chargingStore.get();

  // Check cache (only for first page)
  if (
    !forceRefresh &&
    page === 0 &&
    state.sessionsLastFetched &&
    Date.now() - state.sessionsLastFetched < CACHE_DURATION &&
    state.sessions.length > 0
  ) {
    return state.sessions;
  }

  chargingStore.set({
    ...state,
    sessionsLoading: true,
    sessionsError: null,
  });

  try {
    const result = await api.getChargingSessions(page, 20);

    // Calculate stats
    const sessions = page === 0 ? result.sessions : [...state.sessions, ...result.sessions];
    const totalKwh = sessions.reduce((sum, s) => sum + (s.kWh || 0), 0);
    const totalCost = sessions.reduce((sum, s) => sum + (s.cost || 0), 0);
    const avgCostPerKwh = totalKwh > 0 ? Math.round(totalCost / totalKwh) : 0;

    chargingStore.set({
      ...chargingStore.get(),
      sessions,
      sessionsLoading: false,
      sessionsTotal: result.total,
      sessionsPage: page,
      sessionsLastFetched: Date.now(),
      totalKwh: Math.round(totalKwh * 10) / 10,
      totalCost,
      sessionCount: sessions.length,
      avgCostPerKwh,
    });

    return sessions;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch sessions";
    chargingStore.set({
      ...chargingStore.get(),
      sessionsLoading: false,
      sessionsError: message,
    });
    return [];
  }
}

/**
 * Load more sessions (pagination)
 */
export async function loadMoreSessions() {
  const state = chargingStore.get();
  if (state.sessionsLoading) return;
  if (state.sessions.length >= state.sessionsTotal) return;

  await fetchChargingSessions(state.sessionsPage + 1);
}

/**
 * Reset charging store
 */
export function resetChargingStore() {
  chargingStore.set(initialState);
}

// Computed values
export const hasMoreSessions = computed(chargingStore, (state) => {
  return state.sessions.length < state.sessionsTotal;
});

export const availableStations = computed(chargingStore, (state) => {
  return state.stations.filter((s) => s.status === "available");
});
