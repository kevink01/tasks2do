'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, getAuth, UserCredential } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { useIsAuthenticated } from '@/hooks/auth';
import { googleProvider, startApp } from '@/util/firebase';

type Props = {
	isHeader: boolean;
	text: string;
	toggleMethod?: () => void;
};

function Login({ isHeader = false, text, toggleMethod }: Props) {
	startApp();
	const router = useRouter();
	const { user, loading } = useIsAuthenticated();
	useEffect(() => {
		if (user && !loading) {
			// We already have a user, redirect to the dashboard
			router.push('/dashboard');
		}
	}, [user, loading, router]);

	/**
	 * Checks if user already exists in firestore
	 * If user hasn't registered before, sign the user up
	 * @param user User object when signing in from popup
	 * @returns	Resolves user in db, then redirects to dashboard
	 */
	async function signUserIn(user: UserCredential): Promise<void> {
		if ((await getDoc(doc(getFirestore(), `/users/${user.user.uid}`))).exists()) {
			router.push('/dashboard');
			return;
		}
		await setDoc(doc(getFirestore(), `/users/${user.user.uid}`), {
			id: user.user.uid,
			name: user.user.displayName,
			email: user.user.email,
			photoURL: user.user.photoURL,
		})
			.then(() => {
				router.push('/dashboard');
			})
			.catch((err) => {
				console.log(err);
				// TODO Popup for error
			});
	}

	/* Method for signing in */
	const googleSignIn = () => {
		signInWithPopup(getAuth(), googleProvider)
			.then(async (user) => {
				await signUserIn(user);
			})
			.catch(() => {});
	};
	return isHeader ? (
		<li onClick={toggleMethod}>
			<a onClick={googleSignIn}>{text}</a>
		</li>
	) : (
		<button className='btn btn-primary' onClick={googleSignIn}>
			{text}
		</button>
	);
}

export default Login;
