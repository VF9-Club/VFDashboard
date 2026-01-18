import { atom } from 'nanostores';
import { UNIT_SYSTEMS } from '../utils/unitConversions';

export const unitSystem = atom<string>(UNIT_SYSTEMS.METRIC);

// Load from localStorage on initialization
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    const saved = localStorage.getItem('vf_unit_system');
    if (saved && (saved === UNIT_SYSTEMS.METRIC || saved === UNIT_SYSTEMS.IMPERIAL)) {
      unitSystem.set(saved);
    }
  } catch (e) {
    console.error('Failed to load unit system from localStorage', e);
  }
}

// Subscribe to changes and save to localStorage
unitSystem.subscribe((value) => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('vf_unit_system', value);
    } catch (e) {
      console.error('Failed to save unit system to localStorage', e);
    }
  }
});

export function toggleUnitSystem() {
  const current = unitSystem.get();
  unitSystem.set(
    current === UNIT_SYSTEMS.METRIC ? UNIT_SYSTEMS.IMPERIAL : UNIT_SYSTEMS.METRIC
  );
}

export function setUnitSystem(system: string) {
  if (system === UNIT_SYSTEMS.METRIC || system === UNIT_SYSTEMS.IMPERIAL) {
    unitSystem.set(system);
  }
}
