// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from 'firebase/app';
import { AuthProvider, GoogleAuthProvider, connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { isDev } from './environment';

const firebaseConfig = {
	apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY!}`,
	authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!}`,
	projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!}`,
	storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!}`,
	messagingSenderId: `${process.env.FIREBASE_MESSAGING_SENDER_ID!}`,
	appId: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID!}`,
	measurementId: `${process.env.FIREBASE_MEASUREMENT_ID!}`,
};

/**
 * Initializes the application if there isn't one available
 * Emulators will start if we are in development mode
 */
export function startApp() {
	if (getApps().length === 0) {
		initializeApp(firebaseConfig);
		if (isDev()) {
			try {
				connectAuthEmulator(getAuth(), 'http://localhost:9099', { disableWarnings: true });
				connectFirestoreEmulator(getFirestore(), 'localhost', 8080);
			} catch (err) {
				console.error(err);
				process.exit(1);
			}
		}
	}
}

/**
 * Gets app analytics
 */
export function getAppAnalytics() {
	if (getApps().length === 0) {
		initializeApp(firebaseConfig);
	}
	return getAnalytics();
}

/* Provider for signing in with google */
export const googleProvider = new GoogleAuthProvider() as AuthProvider;
