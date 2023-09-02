'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Center, Stack, Text, Title } from '@mantine/core';

export default function NoEvents() {
	const router = useRouter();

	return (
		<Card>
			<Stack>
				<Title align='center' order={2}>
					Uhoh! You do not have any events
				</Title>
				<Text size='lg' align='center' color='green'>
					{`Let's create some events!`}
				</Text>
			</Stack>
			<Center mx='auto' my='xl'>
				<Button size='sm' color='orange' onClick={() => router.push('/events/create')}>
					Create event
				</Button>
			</Center>
		</Card>
	);
}
