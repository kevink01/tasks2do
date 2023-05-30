export function getTheme() {
	return document.documentElement.classList.contains('dark')
		? 'dark'
		: document.documentElement.classList.contains('light')
		? 'light'
		: 'mytheme';
}
