import { Theme, TypeOptions, toast } from 'react-toastify';
import { Settings } from '@/types/settings';
import { defaultSettings } from './default';

export function notify(message: string, userSettings: Settings | null, type: TypeOptions, theme?: Theme) {
	let settings: Settings;

	if (!userSettings) {
		settings = defaultSettings;
	} else {
		settings = userSettings;
	}

	if (settings.notification.enabled) {
		toast(message, {
			autoClose: settings.notification.duration * 1000,
			position: settings.notification.location,
			theme: theme ?? settings.notification.theme,
			type: type,
		});
	}
}
