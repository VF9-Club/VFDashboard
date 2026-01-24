import { atom, onMount } from "nanostores";
import { api } from "../services/api";

export const isAuthenticated = atom(false);
export const userRegion = atom("vn");
export const userEmail = atom("");

onMount(isAuthenticated, () => {
  // Check if API has session restored (tokens now managed via HttpOnly cookies)
  if (api.isLoggedIn) {
    isAuthenticated.set(true);
    userRegion.set(api.region);
  } else {
    // Double check restoration just in case
    api.restoreSession();
    if (api.isLoggedIn) {
      isAuthenticated.set(true);
      userRegion.set(api.region);
    }
  }
});
