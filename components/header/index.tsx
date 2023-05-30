import ThemeMenu from './theme-menu';
import ProfileMenu from './profile-menu';
import NavMenu from './nav-menu';

function Header() {
	return (
		<div className='navbar'>
			<div className='navbar-start'>
				<NavMenu />
			</div>
			<div className='navbar-center'>tasks2Do</div>
			<div className='navbar-end space-x-2 lg:space-x-4'>
				<ThemeMenu />
				<ProfileMenu />
			</div>
		</div>
	);
}

export default Header;
