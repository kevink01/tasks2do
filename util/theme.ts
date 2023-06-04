/**
 * Retrieves the theme that is set at the root level
 * "mytheme" is the custom theme for the application. This is different than either "light" or "dark" theme
 * @returns Current theme of application
 */
export function getTheme() {
	return document.documentElement.classList.contains('dark')
		? 'dark'
		: document.documentElement.classList.contains('light')
		? 'light'
		: 'mytheme';
}
