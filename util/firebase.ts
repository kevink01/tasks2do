// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { AuthProvider, GoogleAuthProvider, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
	connectFirestoreEmulator,
	enableMultiTabIndexedDbPersistence,
	getFirestore,
	initializeFirestore,
} from 'firebase/firestore';
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

let app;

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

export function getAppAnalytics() {
	if (getApps().length === 0) {
		initializeApp(firebaseConfig);
	}
	return getAnalytics();
}

export const googleProvider = new GoogleAuthProvider() as AuthProvider;
