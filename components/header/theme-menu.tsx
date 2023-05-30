'use client';

import { useState } from 'react';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';

function ThemeMenu() {
	const [theme, setTheme] = useState<'light' | 'dark' | 'mytheme'>('mytheme');
	const toggleLightTheme = () => {
		document.documentElement.classList.remove('dark', 'mytheme');
		document.documentElement.classList.add('light');
		document.documentElement.setAttribute('data-theme', 'light');
		setTheme('light');
	};

	const toggleDarkTheme = () => {
		document.documentElement.classList.remove('light', 'mytheme');
		document.documentElement.classList.add('dark');
		document.documentElement.setAttribute('data-theme', 'dark');
		setTheme('dark');
	};
	const toggleMyTheme = () => {
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add('mytheme');
		document.documentElement.setAttribute('data-theme', 'mytheme');
		setTheme('mytheme');
	};
	return (
		<div className='dropdown dropdown-end dropdown-hover'>
			<label tabIndex={0} className='btn btn-sm lg:btn-md btn-outline m-1 space-x-2'>
				<span>{theme === 'light' ? <FaSun /> : theme === 'dark' ? <FaMoon /> : <FaPalette />}</span>
				<span>{theme === 'mytheme' ? 'Vibrant' : theme}</span>
			</label>
			<ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 lg:w-52'>
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
