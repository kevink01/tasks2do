'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, getAuth, UserCredential } from 'firebase/auth';
import { useIsAuthenticated } from '@/hooks/auth';
import { googleProvider, startApp } from '@/util/firebase';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

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
			router.push('/dashboard');
		}
	}, [user, loading, router]);

	async function signUserIn(user: UserCredential): Promise<void> {
		if ((await getDoc(doc(getFirestore(), `/users/${user.user.uid}`))).exists()) {
			console.log('in here');
			router.push('/dashboard');
			return;
		}
		console.log('past here');
		await setDoc(doc(getFirestore(), `/users/${user.user.uid}`), {
			id: user.user.uid,
			name: user.user.displayName,
			email: user.user.email,
			photoURL: user.user.photoURL,
		})
			.then(() => {
				console.log('done');
				router.push('/dashboard');
			})
			.catch((err) => {
				console.log(err);
			});
	}

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
