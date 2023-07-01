'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { nprogress } from '@mantine/nprogress';

function CustomLink({ children, href }: { children: React.ReactNode; href: string }) {
	useEffect(() => {
		return () => {
			nprogress.complete();
		};
	}, []);
	return (
		<Link href={href} onClick={() => nprogress.start()} className='no-underline text-white'>
			{children}
		</Link>
	);
}

export default CustomLink;
