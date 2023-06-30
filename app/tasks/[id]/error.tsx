'use client';

import { Button, Center, Stack, Text, Title } from '@mantine/core';
import router from 'next/router';

function TaskLoadError() {
	return (
		<Stack>
			<Title align='center' order={2}>
				Uhoh! Something went wrong
			</Title>
			<Text size='lg' align='center' color='red'>
				The task does not exist
			</Text>
			<Center mx='auto' my='xl'>
				<Button size='sm' color='orange' onClick={() => router.push('/dashboard')}>
					Dashboard
				</Button>
			</Center>
		</Stack>
	);
}

export default TaskLoadError;
