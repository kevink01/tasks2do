'use client';

import { CacheProvider } from '@emotion/react';
import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ColorScheme, ColorSchemeProvider, MantineProvider, useEmotionCache, useMantineTheme } from '@mantine/core';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
		<CacheProvider value={cache}>
			<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
				<MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
					<div
						className='h-screen'
						style={{
							backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
							color: colorScheme === 'dark' ? theme.white : theme.colors.gray[7],
						}}>
						<ToastContainer
							position='top-right'
							autoClose={5000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme='dark'
						/>
						{children}
					</div>
				</MantineProvider>
			</ColorSchemeProvider>
		</CacheProvider>
	);
}

export default CustomMantineProvider;
