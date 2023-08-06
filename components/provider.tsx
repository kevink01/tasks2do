'use client';

import { CacheProvider } from '@emotion/react';
import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ColorScheme, ColorSchemeProvider, MantineProvider, useEmotionCache, useMantineTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import 'react-toastify/dist/ReactToastify.css';
import { Notifications } from '@mantine/notifications';

function CustomMantineProvider({ children }: { children: React.ReactNode }) {
	const cache = useEmotionCache();
	cache.compat = true;

	useServerInsertedHTML(() => (
		<style
			data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
			dangerouslySetInnerHTML={{
				__html: Object.values(cache.inserted).join(' '),
			}}
		/>
	));

	const theme = useMantineTheme();
	const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	return (
		<CacheProvider key={'emotion-cache-provider'} value={cache}>
			<ColorSchemeProvider
				key={'mantine-color-scheme-provder'}
				colorScheme={colorScheme}
				toggleColorScheme={toggleColorScheme}>
				<MantineProvider key={'mantine-provider'} theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
					<div
						key={'mantine-background-color'}
						className='min-h-screen'
						style={{
							backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
							color: colorScheme === 'dark' ? theme.white : theme.colors.gray[7],
						}}>
						<Notifications key={'mantine-notification-provider'} />
						<ModalsProvider key={'mantine-modals-provider'}>{children}</ModalsProvider>
					</div>
				</MantineProvider>
			</ColorSchemeProvider>
		</CacheProvider>
	);
}

export default CustomMantineProvider;
