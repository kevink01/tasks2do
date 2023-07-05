export function capitalize(str: string): string {
	if (!str || str.length === 0) return '';
	if (str.length === 1) return str[0].toLocaleUpperCase();
	return str[0].toLocaleUpperCase() + str.slice(1);
}
