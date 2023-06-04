'use client';

import { useRef, MutableRefObject, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { useOnClickOutside } from 'use-hooks';

function NavMenu() {
	const [open, setOpen] = useState<boolean>(false); // State for menu being open
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

	return (
		<div className={`dropdown dropdown-start ${open && 'dropdown-open'}`} ref={ref}>
			<label tabIndex={0} className='btn btn-sm lg:btn-md btn-outline m-1 space-x-2' onClick={toggleMenu}>
				<FaBars />
			</label>
			<ul
				tabIndex={0}
				className={`${!open && 'hidden'} dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 lg:w-52`}>
				<li onClick={closeMenu}>
					<a>Nav 1</a>
				</li>
				<li onClick={closeMenu}>
					<a>Nav 2</a>
				</li>
				<li onClick={closeMenu}>
					<a>Nav 3</a>
				</li>
			</ul>
		</div>
	);
}

export default NavMenu;
