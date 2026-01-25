## 2024-05-21 - React Memoization on Dashboard
**Learning:** The `DigitalTwin` component subscribes to the entire `vehicleStore` via `useStore`. This causes the component to re-render on every telemetry update (e.g., speed change). Child components like `TireCard` and `WarningItem` were defined inline or without memoization, leading to unnecessary re-renders of the DOM even when their specific props (tire pressure, warnings) didn't change.
**Action:** Use `React.memo` for static or semi-static sub-components when the parent component is subscribed to a high-frequency data store.
