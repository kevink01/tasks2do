'use client';

import { FaBars } from 'react-icons/fa';

function NavMenu() {
	return (
		<div className='dropdown dropdown-start'>
			<label tabIndex={0} className='btn btn-sm lg:btn-md btn-outline m-1 space-x-2'>
				<FaBars />
			</label>
			<ul
				tabIndex={0}
				className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 lg:w-52 transition duration-200 ease-in-out'>
				<li>
					<a>Nav 1</a>
				</li>
				<li>
					<a>Nav 2</a>
				</li>
				<li>
					<a>Nav 3</a>
				</li>
			</ul>
		</div>
	);
}

export default NavMenu;
