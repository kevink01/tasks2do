import { MantineTransition } from '@mantine/core';

export function fadeTransition(): MantineTransition {
	return {
		in: { opacity: 1 },
		out: { opacity: 0 },
		transitionProperty: 'opacity',
	};
}

export function scaleTransition(direction: 'X' | 'Y'): MantineTransition {
	return {
		in: { opacity: 1, transform: `scale${direction}(1)` },
		out: { opacity: 0, transform: `scale${direction}(0)` },
		common: { transformOrigin: 'left' },
		transitionProperty: 'transform, opacity',
	};
}
