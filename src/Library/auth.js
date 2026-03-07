import { supabase } from "./Supabase";

/**
 * Get the current authenticated user
 * @returns {Promise<{user: Object|null, error: Error|null}>}
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    return { user: null, error };
  }
}

/**
 * Sign out the current user
 * @returns {Promise<{error: Error|null}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const { user } = await getCurrentUser();
  return !!user;
}

/**
 * Get the current session
 * @returns {Promise<{session: Object|null, error: Error|null}>}
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (error) {
    return { session: null, error };
  }
}

/**
 * Listen to auth state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Object} - Subscription object with unsubscribe method
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
