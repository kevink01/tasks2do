import { startApp } from '@/util/firebase';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

/**
 * Hook for protecting authenticated routes
 * @returns useEffect to redirect user to homepage if not logged in
 */
export function useProtectedRoute() {
	const router = useRouter();
	const { user, loading, error } = useIsAuthenticated();

	return useEffect(() => {
		if (!user && (!loading || error)) {
			router.push('/');
		}
	}, [user, loading, error, router]);
}
