'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
	ActionIcon,
	Flex,
	Group,
	Header,
	rem,
	Tabs,
	Text,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import ProfileMenu from './menu/profile';
import ThemeMenu from './menu/theme';
import t2d from '@/public/task2DoLogo-RemovedBG.png';

const pages: string[] = ['home', 'tasks', 'reminders', 'events'];

function Navigation() {
	const pathname = usePathname();
	const router = useRouter();

	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	return (
		<Header
			height='4rem'
			className='w-full'
			sx={{
				borderBottom: 0,
				paddingTop: 5,
				paddingBottom: 5,
				paddingLeft: 5,
				paddingRight: 5,
				position: 'sticky',
				backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
			}}>
			<Flex align='center' justify='space-between' gap={{ base: 'sm', sm: 'lg' }} className='mx-2'>
				<Group>
					{/* TODO: New logo? */}
					<ActionIcon
						onClick={() => {
							router.push('/');
						}}
						my={rem(12)}>
						<Image src={t2d.src} alt='Logo' width={t2d.width} height={t2d.height} className='bg-white rounded-full' />
					</ActionIcon>
					<Text
						variant='gradient'
						gradient={{ from: 'orange', to: 'yellow', deg: 90 }}
						sx={{ fontFamily: 'Greycliff CF, sans-serif' }}>
						tasks2Do
					</Text>
				</Group>
				<Tabs
					defaultValue='home'
					value={pathname === '/' || pathname === '/dashboard' ? 'home' : (pathname.slice(1).split('/')[0] as string)}
					onTabChange={(page) => {
						page === 'home' ? router.push('/') : router.push(page as string);
					}}
					variant='pills'
					radius='lg'
					color='orange'>
					<Tabs.List>
						{pages.map((page) => {
							return (
								<Tabs.Tab value={page} key={`tab-${page}`} className='transition ease-in-out duration-300'>
									{page.charAt(0).toUpperCase() + page.slice(1)}
								</Tabs.Tab>
							);
						})}
					</Tabs.List>
				</Tabs>
				<div className='flex flex-1 justify-end space-x-4 pr-8'>
					<ThemeMenu />
					<ProfileMenu />
				</div>
			</Flex>
		</Header>
	);
}

export default Navigation;
