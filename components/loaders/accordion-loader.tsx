import { Container, Divider, Flex, Skeleton, Stack } from '@mantine/core';
import { GridLoader } from './grid-loader';

export default function AccordionLoader() {
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
				<GridLoader />
			</Stack>
		</Container>
	);
}
