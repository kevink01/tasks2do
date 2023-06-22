'use client';

import { ActionIcon, Button, Menu, useMantineColorScheme } from '@mantine/core';
import { FaMoon, FaSun } from 'react-icons/fa';

function ThemeMenu() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === 'dark';

	const customToggle = () => {
		toggleColorScheme();
	};

	return (
		<div className='flex space-x-2'>
			<ActionIcon
				title='Toggle color scheme'
				variant='light'
				size='lg'
				radius='xl'
				color={dark ? 'yellow' : 'blue'}
				onClick={customToggle}>
				{dark ? <FaMoon /> : <FaSun />}
			</ActionIcon>
			<Menu position='bottom-end' transitionProps={{ transition: 'pop-bottom-left', duration: 200 }}>
				<Menu.Target>
					<Button variant='light' size='sm' radius='xl' color={dark ? 'yellow' : 'blue'}>
						{colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1)}
					</Button>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item key='menu-theme-toggle-light' onClick={() => toggleColorScheme('light')}>
						Light
					</Menu.Item>
					<Menu.Item key='menu-theme-toggle-dark' onClick={() => toggleColorScheme('dark')}>
						Dark
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	);
}

export default ThemeMenu;
