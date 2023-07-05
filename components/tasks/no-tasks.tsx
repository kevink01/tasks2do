'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Center, Stack, Text, Title } from '@mantine/core';

function NoTasks() {
	const router = useRouter();

	return (
		<Card>
			<Stack>
				<Title align='center' order={2}>
					Uhoh! You do not have any tasks
				</Title>
				<Text size='lg' align='center' color='green'>
					{`Let's create some tasks!`}
				</Text>
			</Stack>
			<Center mx='auto' my='xl'>
				<Button size='sm' color='orange' onClick={() => router.push('/tasks/create')}>
					Create task
				</Button>
			</Center>
		</Card>
	);
}

export default NoTasks;
