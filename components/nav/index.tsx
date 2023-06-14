'use client';

import Image from 'next/image';
import { Header, Group, Text, Flex, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import NavMenu from './nav-menu';
import ProfileMenu from './profile-menu';
import ThemeMenu from './theme-menu';
import Logo from '@/public/task2DoLogo-RemovedBG.png';

function Nav() {
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
					<Image src={Logo.src} alt='Logo' width={Logo.width} height={Logo.height} className='bg-white rounded-full' />
					<Text
						variant='gradient'
						gradient={{ from: 'orange', to: 'yellow', deg: 90 }}
						sx={{ fontFamily: 'Greycliff CF, sans-serif' }}>
						tasks2Do
					</Text>
				</Group>
				<NavMenu />
				<div className='flex flex-1 justify-end space-x-4'>
					<ThemeMenu />
					<ProfileMenu />
				</div>
			</Flex>
		</Header>
	);
}

export default Nav;
