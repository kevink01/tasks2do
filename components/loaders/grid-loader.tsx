import { Card, Divider, Grid, Group, Skeleton, Stack, rem } from '@mantine/core';
import React from 'react';

export function GridLoader(): React.JSX.Element {
	return (
		<Grid gutter={5}>
			{Array(5).map((i) => {
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
