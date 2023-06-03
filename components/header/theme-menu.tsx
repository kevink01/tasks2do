'use client';

import { MutableRefObject, useRef, useState } from 'react';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import { useOnClickOutside } from 'use-hooks';

function ThemeMenu() {
	const [theme, setTheme] = useState<'light' | 'dark' | 'mytheme'>('mytheme');
	const [open, setOpen] = useState<boolean>(false);

	const ref = useRef<HTMLDivElement>(null);
	useOnClickOutside(ref as MutableRefObject<Node>, () => setOpen(false));
	const toggleMenu = () => {
		setOpen((prev) => !prev);
	};
	const closeMenu = () => {
		setOpen(false);
	};

	const toggleLightTheme = () => {
		closeMenu();
		document.documentElement.classList.remove('dark', 'mytheme');
		document.documentElement.classList.add('light');
		document.documentElement.setAttribute('data-theme', 'light');
		setTheme('light');
	};

	const toggleDarkTheme = () => {
		closeMenu();
		document.documentElement.classList.remove('light', 'mytheme');
		document.documentElement.classList.add('dark');
		document.documentElement.setAttribute('data-theme', 'dark');
		setTheme('dark');
	};
	const toggleMyTheme = () => {
		closeMenu();
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add('mytheme');
		document.documentElement.setAttribute('data-theme', 'mytheme');
		setTheme('mytheme');
	};

	return (
		<div className={`dropdown dropdown-end ${open && 'dropdown-open'}`} ref={ref}>
			<label tabIndex={0} className='btn btn-sm lg:btn-md btn-outline m-1 space-x-2' onClick={toggleMenu}>
				<span>{theme === 'light' ? <FaSun /> : theme === 'dark' ? <FaMoon /> : <FaPalette />}</span>
				<span>{theme === 'mytheme' ? 'Vibrant' : theme}</span>
			</label>
			<ul
				tabIndex={0}
				className={`${!open && 'hidden'} dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 lg:w-52`}>
				<li>
					<a onClick={toggleLightTheme}>Light</a>
				</li>
				<li>
					<a onClick={toggleDarkTheme}>Dark</a>
				</li>
				<li>
					<a onClick={toggleMyTheme}>Vibrant</a>
				</li>
			</ul>
		</div>
	);
}

export default ThemeMenu;