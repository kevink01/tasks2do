'use client';

import { useProtectedRoute } from '@/hooks/auth';
import { useUserDocument } from '@/hooks/firestore';
import useReminders from '@/hooks/use-reminders';
import { useSettings } from '@/hooks/use-settings';
import { ReminderFetch } from '@/types/reminder';
import { notify, updateNotification } from '@/util/notifications/notify';
import { Alert, Card, Container, LoadingOverlay, Transition, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { doc, getFirestore } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaExclamation, FaTrash } from 'react-icons/fa';
import ReminderLoading from './loading';
import ReminderError from './error';
import { fadeTransition } from '@/util/transition';
import ReminderView from '@/components/reminders/reminder-view';
import UpdateReminder from '@/components/reminders/reminder-update';

type ReminderProps = {
	edit?: boolean;
};

type RequiredReminderProps = Required<ReminderProps>;

const defaultProps: RequiredReminderProps = {
	edit: false,
};

export default function ReminderIDPage({ params, propsIn }: { params: { id: string }; propsIn: ReminderProps }) {
	useProtectedRoute();
	const { settings, loading } = useSettings();
	const reminder = useUserDocument<ReminderFetch>((user) =>
		doc(getFirestore(), `/users/${user.uid}/reminders/${params.id}`)
	);
	const { deleteReminder } = useReminders();

	const props: RequiredReminderProps = { ...defaultProps, ...propsIn };
	const searchParams = useSearchParams();

	const [editMode, setEditMode] = useState<boolean>(props.edit || (searchParams.get('edit') === 'true' ? true : false));
	const [transition, setTransition] = useState<boolean>(false);

	const toggleEditMode = (edit?: boolean) => {
		setTransition(true);
		setTimeout(() => {
			setEditMode((mode) => edit ?? !mode);
			setTransition(false);
		}, 200);
	};

	const promptDeleteReminder = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Deleting reminder',
			children: (
				<Container>
					<Alert icon={<FaExclamation />} title='Are you sure you want to delete?' color='red' radius='xs' mb={rem(4)}>
						This action cannot be undone
					</Alert>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'red', disabled: !reminder[0] },
			onConfirm: () => {
				if (reminder[0]) {
					const id = notify(
						`delete-reminder-${reminder[0].id}`,
						`Deleting reminder: ${reminder[0].name}`,
						'Your data will be loaded',
						true,
						settings,
						'info'
					);
					const result = deleteReminder(reminder[0]);
					if (result.success) {
						updateNotification(id, 'Success!', 'Successfully deleted reminder', settings, 'success', <FaTrash />);
					} else {
						updateNotification(id, 'Error!', 'Unable to delete reminder', settings, 'error');
					}
				} else {
					notify(`delete-reminder-${Date.now()}-null`, 'Error', 'Reminder is null', false, settings, 'error');
				}
			},
		});
	};

	return (
		<Container size='md' px='xs' pt='lg'>
			<Card shadow='sm' padding='sm' radius='md' withBorder className='relative'>
				<LoadingOverlay
					visible={(!reminder[0] && reminder[1]) || loading}
					overlayBlur={2}
					transitionDuration={500}
					loaderProps={{ size: 'md', color: 'orange', variant: 'oval' }}
				/>
				{!settings || !reminder[0] ? (
					<ReminderLoading />
				) : !reminder[0] && reminder[3] && !reminder[3].exists() ? (
					<ReminderError />
				) : (
					<Transition mounted={!transition} transition={fadeTransition()} duration={200} timingFunction='ease'>
						{(styles) => (
							<div style={styles}>
								{editMode
									? (reminder[0] && (
											<UpdateReminder
												reminder={reminder[0]}
												settings={settings}
												promptDeleteReminder={promptDeleteReminder}
												toggleEditMode={toggleEditMode}
											/>
									  )) ?? <ReminderError />
									: (reminder[0] && (
											<ReminderView
												reminder={reminder[0]}
												promptDeleteReminder={promptDeleteReminder}
												toggleEditMode={toggleEditMode}
											/>
									  )) ?? <ReminderError />}
							</div>
						)}
					</Transition>
				)}
			</Card>
		</Container>
	);
}
