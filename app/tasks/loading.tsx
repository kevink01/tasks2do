'use client';

import { Card, Container, Divider, Flex, Grid, Group, Skeleton, Stack, rem } from '@mantine/core';

export function TasksGridLoader(): React.JSX.Element {
	return (
		<Grid gutter={5}>
			{Array.of<string>('0', '1', '2', '3', '4').map((i) => {
				return (
					<Grid.Col span={4} key={`task-skeleton-card-${i}`}>
						<Card shadow='sm' padding='sm' radius='md' withBorder>
							<Card.Section px={rem(12)} py={rem(4)}>
								<Stack spacing={rem(4)}>
									<Skeleton width={160} height={25} />
									<Skeleton width={240} height={20} />
								</Stack>
							</Card.Section>
							<Divider />
							<Card.Section px={rem(12)} py={rem(4)}>
								<Stack spacing={rem(4)}>
									<Skeleton width={140} height={20} />
									<Skeleton width={200} height={20} />
									<Skeleton width={170} height={20} />
								</Stack>
							</Card.Section>
							<Card.Section px={rem(12)} py={rem(4)}>
								<Group spacing={rem(4)}>
									<Skeleton width={130} height={40} />
									<Skeleton width={130} height={40} />
								</Group>
							</Card.Section>
							<Card.Section px={rem(12)} py={rem(4)}>
								<Stack spacing={rem(4)}>
									<Skeleton width={270} height={15} />
									<Skeleton width={270} height={15} />
								</Stack>
							</Card.Section>
						</Card>
					</Grid.Col>
				);
			})}
		</Grid>
	);
}

function TasksLoader() {
	return (
		<Container size='lg' px='xs'>
			<Stack spacing='xs'>
				<Flex gap='xs'>
					<Skeleton height={40} className='w-[90%]' />
					<Skeleton width={110} height={40} />
					<Skeleton circle height={40} />
				</Flex>
				<Skeleton height={40} />
				<Divider />
				<TasksGridLoader />
			</Stack>
		</Container>
	);
}

export default TasksLoader;
