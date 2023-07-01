'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Center, Container, Loader, Text } from '@mantine/core';
import { useIsAuthenticated } from '@/hooks/auth';
import { googleSignIn, startApp } from '@/util/firebase';

export default function Home() {
	startApp();

	const router = useRouter();
	const { user, loading } = useIsAuthenticated();

	useEffect(() => {
		if (user && !loading) {
			// We already have a user, redirect to the dashboard
			router.push('/dashboard');
		}
	}, [user, loading, router]);

	return (
		<Container fluid className={`flex flex-col justify-center items-center w-full h-5/6 space-y-2`}>
			{loading || user ? (
				<Center>
					<Loader color='orange' size='xl' variant='dots' />
				</Center>
			) : (
				<div>
					<div className='max-w-xs text-center'>
						<Text>Welcome to tasks2Do!</Text>
						<Text>We&apos;re here to track all your tasks, chores, reminders - you name it! </Text>
					</div>
					<Button
						color='orange'
						radius='xl'
						size='lg'
						onClick={googleSignIn}
						className='transition duration-500 ease-in-out hover:bg-orange-700'>
						Sign in with Google
					</Button>
				</div>
			)}
		</Container>
	);
}
