'use client';

import { Card, Container, Skeleton, Stack } from '@mantine/core';

export default function ReminderLoading() {
	return (
		<Container size='md' px='xs' pt='lg'>
			<Card>
				<Stack spacing='sm'>
					<Skeleton height={40} />
					<Skeleton height={40} />
					<Skeleton height={40} />
					<Skeleton height={10} />
					<Skeleton height={40} />
					<Skeleton height={10} />
					<Skeleton height={40} />
				</Stack>
			</Card>
		</Container>
	);
}
