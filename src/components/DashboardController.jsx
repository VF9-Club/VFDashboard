import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  fetchTelemetry,
  fetchUser,
  fetchVehicles,
  vehicleStore,
} from "../stores/vehicleStore";
import { REFRESH_INTERVAL, resetRefreshTimer } from "../stores/refreshTimerStore";

export default function DashboardController({ vin: initialVin }) {
  const { vin } = useStore(vehicleStore);

  useEffect(() => {
    const init = async () => {
      let targetVin = initialVin || vin;

      // Ensure we have User profile
      fetchUser();

      // If no VIN, fetch it
      if (!targetVin) {
        targetVin = await fetchVehicles();
      }

      // Initial telemetry fetch
      if (targetVin) {
        fetchTelemetry(targetVin);
      }
    };

    init();
  }, [initialVin]); // Only run on load or if SSR vin changes

  // Polling Effect
  useEffect(() => {
    // Polling Interval: 5 hours (18000000 ms)
    const interval = setInterval(() => {
      const currentVin = vin || initialVin;
      if (currentVin) {
        fetchTelemetry(currentVin);
        fetchUser(); // Refresh user too
        resetRefreshTimer(); // Reset the countdown timer
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [vin, initialVin]);

  return null; // Headless
}
