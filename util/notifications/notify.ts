import { notifications } from '@mantine/notifications';
import { defaultSettings } from '../default';
import { notiError, notiInfo, notiWarn } from './icons';
import { NotificationType, Settings } from '@/types/settings';

function getNotificationTypes(type: NotificationType): { userColor: string; userIcon: React.ReactNode } {
	switch (type) {
		case 'info': {
			return {
				userColor: 'blue',
				userIcon: notiInfo,
			};
		}
		case 'success': {
			return {
				userColor: 'green',
				userIcon: null,
			};
		}
		case 'warning': {
			return {
				userColor: 'orange',
				userIcon: notiWarn,
			};
		}
		case 'error':
		default: {
			return {
				userColor: 'red',
				userIcon: notiError,
			};
		}
	}
}

export function notify(
	id: string,
	title: string,
	message: string,
	loading: boolean,
	userSettings: Settings | null,
	type: NotificationType,
	icon?: React.ReactNode
): string {
	let settings: Settings;

	if (!userSettings) {
		settings = defaultSettings;
	} else {
		settings = userSettings;
	}

	if (settings.notification.enabled) {
		const userTheme = settings.notification.theme;
		const { userColor, userIcon } = getNotificationTypes(type);

		notifications.show({
			id: id,
			title: title,
			message: message,
			icon: loading ? null : userIcon ?? icon,
			loading: loading,
			color: userColor,
			autoClose: loading ? false : settings.notification.duration * 1000,
			styles: (theme) => ({
				root: {
					backgroundColor:
						userTheme === 'light'
							? theme.white
							: userTheme === 'colored'
							? theme.colors.orange[5]
							: theme.colors.dark[6],
					'&::before': {
						backgroundColor: userColor,
					},
				},
				title: { color: userTheme === 'light' || userTheme === 'colored' ? theme.black : theme.white },
				description: {
					color: userTheme === 'light' || userTheme === 'colored' ? theme.colors.dark[8] : theme.colors.dark[2],
				},
				closeButton: {
					color: userTheme === 'light' || userTheme === 'colored' ? theme.black : theme.white,
					'&:hover': { backgroundColor: theme.colors.dark[7] },
				},
				icon: { backgroundColor: theme.colors.red[5] },
			}),
		});
	}
	return id;
}

export function updateNotification(
	id: string,
	title: string,
	message: string,
	userSettings: Settings | null,
	type: NotificationType,
	icon?: React.ReactNode
) {
	let settings: Settings;

	if (!userSettings) {
		settings = defaultSettings;
	} else {
		settings = userSettings;
	}

	if (settings.notification.enabled) {
		const userTheme = settings.notification.theme;
		const { userColor, userIcon } = getNotificationTypes(type);

		notifications.update({
			id: id,
			title: title,
			message: message,
			icon: userIcon ?? icon ?? null,
			loading: false,
			color: userColor,
			autoClose: settings.notification.duration * 1000,
			styles: (theme) => ({
				root: {
					backgroundColor:
						userTheme === 'light'
							? theme.white
							: userTheme === 'colored'
							? theme.colors.orange[5]
							: theme.colors.dark[6],
					'&::before': {
						backgroundColor:
							userColor === 'red'
								? theme.colors.red[5]
								: userColor === 'orange'
								? theme.colors.orange[5]
								: userColor === 'green'
								? theme.colors.green[5]
								: theme.colors.blue[5],
					},
				},
				title: { color: userTheme === 'light' || userTheme === 'colored' ? theme.black : theme.white },
				description: {
					color: userTheme === 'light' || userTheme === 'colored' ? theme.colors.dark[8] : theme.colors.dark[2],
				},
				closeButton: {
					color: userTheme === 'light' || userTheme === 'colored' ? theme.black : theme.white,
					'&:hover': { backgroundColor: theme.colors.dark[7] },
				},
				icon: {
					backgroundColor:
						userColor === 'red'
							? theme.colors.red[5]
							: userColor === 'orange'
							? theme.colors.orange[5]
							: userColor === 'green'
							? theme.colors.green[5]
							: theme.colors.blue[5],
				},
			}),
		});
	}
}
