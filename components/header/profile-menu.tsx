'use client';

import { useIsAuthenticated } from '@/hooks/auth';
import Login from '../login';
import { useRouter } from 'next/navigation';
import { signOut, getAuth } from 'firebase/auth';
import { getTheme } from '@/util/theme';

function ProfileMenu() {
	const router = useRouter();
	const { user, loading } = useIsAuthenticated();
	const signUserOut = () => {
		if (!loading) {
			signOut(getAuth()).then(() => {
				router.push('/');
			});
		}
	};

	const theme = getTheme();
	return (
		<div className='dropdown dropdown-end dropdown-hover'>
			<div className='avatar placeholder' tabIndex={0}>
				<div className='bg-neutral-focus text-neutral-content rounded-full w-10 lg:w-12'>
					<span>t2d</span>
				</div>
			</div>
			<ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 lg:w-52'>
				<li>
					<a>Profile</a>
				</li>
				<li>
					<a>Settings</a>
				</li>
				<div
					className={`divider w-full h-px ${theme === 'mytheme' && 'bg-gray-500'} ${
						theme !== 'mytheme' && 'bg-orange-500'
					}`}></div>
				{!user && <Login text='Sign in' isHeader={true} />}
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
