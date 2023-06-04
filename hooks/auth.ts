import { startApp } from '@/util/firebase';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

/**
 * Hook for protecting authenticated routes. If there is no user, return null
 * @returns Hook for loading user information
 */
export function useIsAuthenticated() {
	startApp(); // Will only call if there's no apps installed
	const [user, loading, error] = useAuthState(getAuth());
	return { user: user ?? null, loading, error };
}
