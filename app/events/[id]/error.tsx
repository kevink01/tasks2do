'use client';

import { Button, Center, Stack, Text, Title } from '@mantine/core';
import CustomLink from '@/components/custom-link';

export default function EventError() {
	return (
		<Stack>
			<Title align='center' order={2}>
				Uhoh! Something went wrong
			</Title>
			<Text size='lg' align='center' color='red'>
				The event does not exist
			</Text>
			<Center mx='auto' my='xl'>
				<CustomLink href='/dashboard'>
					<Button size='sm' color='orange'>
						Dashboard
					</Button>
				</CustomLink>
			</Center>
		</Stack>
	);
}
