// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { isDev } from './environment';

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY!,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
	projectId: process.env.FIREBASE_PROJECT_ID!,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
	appId: process.env.FIREBASE_APP_ID!,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export function startApp() {
	if (getApps().length === 0) {
		initializeApp(firebaseConfig);
		if (isDev()) {
			try {
				connectAuthEmulator(getAuth(), 'http://localhost:9099', { disableWarnings: true });
				connectFirestoreEmulator(getFirestore(), 'http://localhost:8080', 8080);
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
