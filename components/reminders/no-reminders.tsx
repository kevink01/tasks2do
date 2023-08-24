'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Center, Stack, Text, Title } from '@mantine/core';

export default function NoReminders() {
	const router = useRouter();

	return (
		<Card>
			<Stack>
				<Title align='center' order={2}>
					Uhoh! You do not have any reminders
				</Title>
				<Text size='lg' align='center' color='green'>
					{`Let's create some reminders!`}
				</Text>
			</Stack>
			<Center mx='auto' my='xl'>
				<Button size='sm' color='orange' onClick={() => router.push('/reminders/create')}>
					Create reminder
				</Button>
			</Center>
		</Card>
	);
}
