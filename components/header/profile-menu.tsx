'use client';

import { MutableRefObject, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnClickOutside } from 'use-hooks';
import { signOut, getAuth } from 'firebase/auth';
import Login from '../login';
import { useIsAuthenticated } from '@/hooks/auth';
import { getTheme } from '@/util/theme';

function ProfileMenu() {
	const router = useRouter();
	const [open, setOpen] = useState<boolean>(false); // State for menu being open

	const { user, loading } = useIsAuthenticated();

	/* Method for signing user out */
	const signUserOut = () => {
		closeMenu();
		if (!loading) {
			signOut(getAuth()).then(() => {
				// Redirect to home (login) page
				router.push('/');
			});
		}
	};

	const ref = useRef<HTMLDivElement>(null);
	useOnClickOutside(ref as MutableRefObject<Node>, () => setOpen(false));
	/* Toggle menu state */
	const toggleMenu = () => {
		setOpen((prev) => !prev);
	};
	/* Close menu */
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
