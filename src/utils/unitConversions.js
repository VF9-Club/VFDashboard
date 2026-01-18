/**
 * Unit Conversion Utilities
 * Handles conversion between metric and imperial units
 */

export const UNIT_SYSTEMS = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
};

/**
 * Convert kilometers to miles
 * @param {number} km - Distance in kilometers
 * @returns {number} Distance in miles
 */
export function kmToMiles(km) {
  if (km === null || km === undefined) return null;
  return km * 0.621371;
}

/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius) {
  if (celsius === null || celsius === undefined) return null;
  return (celsius * 9/5) + 32;
}

/**
 * Convert Bar to PSI
 * @param {number} bar - Pressure in Bar
 * @returns {number} Pressure in PSI
 */
export function barToPsi(bar) {
  if (bar === null || bar === undefined) return null;
  return bar * 14.5038;
}

/**
 * Format distance based on unit system
 * @param {number} value - Distance value
 * @param {string} unitSystem - 'metric' or 'imperial'
 * @returns {object} { value: number, unit: string }
 */
export function formatDistance(value, unitSystem = UNIT_SYSTEMS.METRIC) {
  if (value === null || value === undefined) return { value: null, unit: null };

  if (unitSystem === UNIT_SYSTEMS.IMPERIAL) {
    return {
      value: Math.round(kmToMiles(value)),
      unit: 'mi',
    };
  }

  return {
    value: Math.round(value),
    unit: 'km',
  };
}

/**
 * Format temperature based on unit system
 * @param {number} value - Temperature value
 * @param {string} unitSystem - 'metric' or 'imperial'
 * @returns {object} { value: number, unit: string }
 */
export function formatTemperature(value, unitSystem = UNIT_SYSTEMS.METRIC) {
  if (value === null || value === undefined) return { value: null, unit: null };

  if (unitSystem === UNIT_SYSTEMS.IMPERIAL) {
    return {
      value: Math.round(celsiusToFahrenheit(value)),
      unit: '°F',
    };
  }

  return {
    value: Math.round(value),
    unit: '°C',
  };
}

/**
 * Format tire pressure based on unit system
 * @param {number} value - Pressure value in Bar
 * @param {string} unitSystem - 'metric' or 'imperial'
 * @returns {object} { value: number, unit: string }
 */
export function formatPressure(value, unitSystem = UNIT_SYSTEMS.METRIC) {
  if (value === null || value === undefined) return { value: null, unit: null };

  if (unitSystem === UNIT_SYSTEMS.IMPERIAL) {
    return {
      value: Number(barToPsi(value).toFixed(1)),
      unit: 'PSI',
    };
  }

  return {
    value: Number(value.toFixed(1)),
    unit: 'Bar',
  };
}

/**
 * Get pressure thresholds based on unit system
 * @param {string} unitSystem - 'metric' or 'imperial'
 * @returns {object} { low: number, high: number, critical: number }
 */
export function getPressureThresholds(unitSystem = UNIT_SYSTEMS.METRIC) {
  const metricThresholds = {
    low: 2.0,
    high: 3.0,
    critical: 1.8,
  };

  if (unitSystem === UNIT_SYSTEMS.IMPERIAL) {
    return {
      low: barToPsi(metricThresholds.low),
      high: barToPsi(metricThresholds.high),
      critical: barToPsi(metricThresholds.critical),
    };
  }

  return metricThresholds;
}

/**
 * Get temperature thresholds based on unit system
 * @param {string} unitSystem - 'metric' or 'imperial'
 * @returns {object} { high: number }
 */
export function getTemperatureThresholds(unitSystem = UNIT_SYSTEMS.METRIC) {
  const metricThresholds = {
    high: 45,
  };

  if (unitSystem === UNIT_SYSTEMS.IMPERIAL) {
    return {
      high: celsiusToFahrenheit(metricThresholds.high),
    };
  }

  return metricThresholds;
}
