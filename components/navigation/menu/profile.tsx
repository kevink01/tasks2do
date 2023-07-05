'use client';

import { useRouter } from 'next/navigation';
import { Avatar, Divider, Menu } from '@mantine/core';
import { getAuth, signOut } from 'firebase/auth';
import { FaUser } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import CustomLink from '@/components/custom-link';
import { useIsAuthenticated } from '@/hooks/auth';
import { googleSignIn } from '@/util/firebase';

function ProfileMenu() {
	const router = useRouter();

	const { user, loading } = useIsAuthenticated();

	/* Method for signing user out */
	const signUserOut = () => {
		if (!loading) {
			signOut(getAuth()).then(() => {
				// Redirect to home (login) page
				router.push('/');
			});
		}
	};

	return (
		<Menu position='bottom-end' transitionProps={{ transition: 'pop-bottom-left', duration: 200 }}>
			<Menu.Target>
				<Avatar color='cyan' radius='xl'>
					MK
				</Avatar>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label key='menu-profile-label'>Profile</Menu.Label>
				<Menu.Item key='menu-profile-choice' icon={<FaUser />}>
					<CustomLink href='/settings'>Profile</CustomLink>
				</Menu.Item>
				<Menu.Item key='menu-settings-choice' icon={<FiSettings />}>
					<CustomLink href='/settings'>Settings</CustomLink>
				</Menu.Item>
				<Divider key={'menu-divider'} />
				{!user && !loading && (
					<Menu.Item key='menu-profile-signin' onClick={() => googleSignIn(router)}>
						Sign In
					</Menu.Item>
				)}
				{user && !loading && (
					<Menu.Item key='menu-profile-signout' onClick={signUserOut}>
						Sign Out
					</Menu.Item>
				)}
			</Menu.Dropdown>
		</Menu>
	);
}

export default ProfileMenu;
