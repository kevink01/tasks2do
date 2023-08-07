'use client';

import { Center, Container, Group, Skeleton, Stack, rem } from '@mantine/core';

export default function ReminderCreateLoading() {
	return (
		<Container size='md' px='xs'>
			<Stack>
				<Group spacing='xs'>
					<Skeleton width={50} height={10}></Skeleton>
					<Skeleton width={5} height={5} />
					<Skeleton height={40} />
				</Group>
				<Group spacing='xs'>
					<Skeleton width={100} height={10}></Skeleton>
					<Skeleton width={5} height={5} />
					<Skeleton height={80} />
				</Group>
				<Group spacing='xs'>
					<Skeleton width={125} height={10}></Skeleton>
					<Skeleton width={5} height={5} />
					<Skeleton height={40} />
				</Group>
				<Center mt={rem(10)}>
					<Skeleton width={120} height={40} />
				</Center>
			</Stack>
		</Container>
	);
}
