'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, getAuth } from 'firebase/auth';
import { useIsAuthenticated } from '@/hooks/auth';
import { googleProvider } from '@/util/firebase';

type Props = {
	isHeader: boolean;
	text: string;
};

function Login({ isHeader = false, text }: Props) {
	const router = useRouter();
	const { user, loading } = useIsAuthenticated();
	useEffect(() => {
		if (user && !loading) {
			router.push('/dashboard');
		}
	}, [user, loading, router]);

	const googleSignIn = () => {
		signInWithPopup(getAuth(), googleProvider)
			.then((user) => {
				router.push('/dashboard');
			})
			.catch(() => {});
	};
	return isHeader ? (
		<li>
			<a onClick={googleSignIn}>{text}</a>
		</li>
	) : (
		<button className='btn btn-primary' onClick={googleSignIn}>
			{text}
		</button>
	);
}

export default Login;
