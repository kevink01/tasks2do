import { useRouter } from 'next/navigation';
import { getAnalytics } from 'firebase/analytics';
import { getApps, initializeApp } from 'firebase/app';
import {
	AuthProvider,
	GoogleAuthProvider,
	UserCredential,
	connectAuthEmulator,
	getAuth,
	signInWithPopup,
} from 'firebase/auth';
import { connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { isDev } from './environment';
import { defaultSettings } from './default';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const firebaseConfig = {
	apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY!}`,
	authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!}`,
	projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!}`,
	storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!}`,
	messagingSenderId: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!}`,
	appId: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID!}`,
	measurementId: `${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!}`,
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

/**
 * Method for signing user in
 * Will add user to database and redirect to dashboard
 */
export const googleSignIn = (router: AppRouterInstance) => {
	signInWithPopup(getAuth(), googleProvider)
		.then(async (user: UserCredential) => {
			if ((await getDoc(doc(getFirestore(), `/users/${user.user.uid}`))).exists()) {
				router.push('/dashboard');
				return;
			}
			await setDoc(doc(getFirestore(), `/users/${user.user.uid}`), {
				id: user.user.uid,
				name: user.user.displayName,
				email: user.user.email,
				photoURL: user.user.photoURL,
				settings: defaultSettings,
			})
				.then(() => {
					router.push('/dashboard');
				})
				.catch((err) => {
					console.log(err);
					// TODO Popup for error
				});
		})
		.catch((err) => {
			console.error(err);
		});
};
