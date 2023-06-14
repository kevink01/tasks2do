'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs } from '@mantine/core';

const pages: string[] = ['home', 'tasks', 'reminders', 'events'];

function NavMenu() {
	const pathname = usePathname();
	const router = useRouter();

	return (
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
						<Tabs.Tab value={page} key={page} className='transition ease-in-out duration-300'>
							{page.charAt(0).toUpperCase() + page.slice(1)}
						</Tabs.Tab>
					);
				})}
			</Tabs.List>
		</Tabs>
	);
}

export default NavMenu;
