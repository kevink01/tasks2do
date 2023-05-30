// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { AuthProvider, GoogleAuthProvider, connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { isDev } from './environment';

const firebaseConfig = {
	apiKey: `${process.env.firebase_apiKey!}`,
	authDomain: `${process.env.firebase_authDomain!}`,
	projectId: `${process.env.firebase_projectId!}`,
	storageBucket: `${process.env.firebase_storageBucket!}`,
	messagingSenderId: `${process.env.firebase_messagingSenderId!}`,
	appId: `${process.env.firebase_appId!}`,
	measurementId: `${process.env.measurementId}`,
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

export const googleProvider = new GoogleAuthProvider() as AuthProvider;
