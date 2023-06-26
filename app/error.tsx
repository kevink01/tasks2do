'use client';

import React, { useEffect } from 'react';
import { Text } from '@mantine/core';

function CustomError({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
		console.log('here');
	}, [error]);

	return (
		<div>
			<Text>Something went wrong!</Text>
			<button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}>
				Try again
			</button>
		</div>
	);
}

export default CustomError;
