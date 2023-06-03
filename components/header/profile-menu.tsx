'use client';

import { useIsAuthenticated } from '@/hooks/auth';
import Login from '../login';
import { useRouter } from 'next/navigation';
import { signOut, getAuth } from 'firebase/auth';
import { getTheme } from '@/util/theme';
import { MutableRefObject, useRef, useState } from 'react';
import { useOnClickOutside } from 'use-hooks';

function ProfileMenu() {
	const router = useRouter();
	const [open, setOpen] = useState<boolean>(false);

	const { user, loading } = useIsAuthenticated();
	const signUserOut = () => {
		closeMenu();
		if (!loading) {
			signOut(getAuth()).then(() => {
				router.push('/');
			});
		}
	};

	const ref = useRef<HTMLDivElement>(null);
	useOnClickOutside(ref as MutableRefObject<Node>, () => setOpen(false));
	const toggleMenu = () => {
		setOpen((prev) => !prev);
	};
	const closeMenu = () => {
		setOpen(false);
	};

	const theme = getTheme();

	return (
		<div className={`dropdown dropdown-end ${open && 'dropdown-open'}`} ref={ref}>
			<div className='avatar placeholder' tabIndex={0} onClick={toggleMenu}>
				<div className='bg-neutral-focus text-neutral-content rounded-full w-10 lg:w-12'>
					<span>t2d</span>
				</div>
			</div>
			<ul
				tabIndex={0}
				className={`${!open && 'hidden'} dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 lg:w-52`}>
				<li onClick={closeMenu}>
					<a>Profile</a>
				</li>
				<li onClick={closeMenu}>
					<a>Settings</a>
				</li>
				<div
					className={`divider w-full h-px ${theme === 'mytheme' && 'bg-gray-500'} ${
						theme !== 'mytheme' && 'bg-orange-500'
					}`}
					onClick={closeMenu}></div>
				{!user && <Login text='Sign in' isHeader={true} toggleMethod={closeMenu} />}
				{user && (
					<li>
						<a onClick={signUserOut}>Sign Out</a>
					</li>
				)}
			</ul>
		</div>
	);
}

export default ProfileMenu;
