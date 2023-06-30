'use client';

import React, { useEffect } from 'react';
import { Button, Container, Text } from '@mantine/core';

function CustomError({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<Container size='md' px='xs' pt='lg'>
			<Text>Something went wrong!</Text>
			<Button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}>
				Try again
			</Button>
		</Container>
	);
}

export default CustomError;
