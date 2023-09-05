'use client';

import { useProtectedRoute } from '@/hooks/auth';
import { useUserDocument } from '@/hooks/firestore';
import { useEvents } from '@/hooks/use-events';
import { useSettings } from '@/hooks/use-settings';
import { EventFetch } from '@/types/event';
import { notify, updateNotification } from '@/util/notifications/notify';
import { Alert, Card, Container, LoadingOverlay, Transition, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { doc, getFirestore } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { FaExclamation, FaTrash } from 'react-icons/fa';
import EventLoading from './loading';
import EventError from './error';
import { fadeTransition } from '@/util/transition';
import EventView from '@/components/events/event-view';
import UpdateEvent from '@/components/events/event-update';

type EventProps = {
	edit?: boolean;
};

type RequiredEventProps = Required<EventProps>;

const defaultProps: RequiredEventProps = {
	edit: false,
};

export default function EventIDPage({ params, propsIn }: { params: { id: string }; propsIn: EventProps }) {
	useProtectedRoute();
	const { settings, loading } = useSettings();

	const event = useUserDocument<EventFetch>((user) => doc(getFirestore(), `/users/${user.uid}/events/${params.id}`));

	const { deleteEvent } = useEvents();

	const props: RequiredEventProps = { ...defaultProps, ...propsIn };
	const searchParams = useSearchParams();
	const router = useRouter();

	const [editMode, setEditMode] = useState<boolean>(props.edit || (searchParams.get('edit') === 'true' ? true : false));
	const [transition, setTransition] = useState<boolean>(false);

	const toggleEditMode = (edit?: boolean) => {
		setTransition(true);
		setTimeout(() => {
			setEditMode((mode) => edit ?? !mode);
			setTransition(false);
			searchParams.has('edit')
				? router.replace(`/events/${params.id}`)
				: router.replace(`/events/${params.id}?edit=true`);
		}, 200);
	};

	const promptDeleteEvent = () => {
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
			confirmProps: { color: 'red', disabled: !event[0] },
			onConfirm: () => {
				if (event[0]) {
					const id = notify(
						`delete-event-${event[0].id}`,
						`Deleting event: ${event[0].name}`,
						'Your data will be loaded',
						true,
						settings,
						'info'
					);
					const result = deleteEvent(event[0]);
					if (result.success) {
						updateNotification(id, 'Success!', 'Successfully deleted event', settings, 'success', <FaTrash />);
					} else {
						updateNotification(id, 'Error!', 'Unable to delete event', settings, 'error');
					}
				} else {
					notify(`delete-event-${Date.now()}-null`, 'Error', 'Event is null', false, settings, 'error');
				}
			},
		});
	};

	return (
		<Container size='md' px='xs' pt='lg'>
			<Card shadow='sm' padding='sm' radius='md' withBorder className='relative'>
				<LoadingOverlay
					visible={(!event[0] && event[1]) || loading}
					overlayBlur={2}
					transitionDuration={500}
					loaderProps={{ size: 'md', color: 'orange', variant: 'oval' }}
				/>
				{!settings || !event[0] ? (
					<div>Hello</div>
				) : event[0] && event[3] && !event[3].exists() ? (
					<EventError />
				) : (
					<Transition mounted={!transition} transition={fadeTransition()} duration={200} timingFunction='ease'>
						{(styles) => (
							<div style={styles}>
								{!event[0] ? (
									<EventError />
								) : editMode ? (
									<UpdateEvent
										event={event[0]}
										settings={settings}
										promptDeleteEvent={promptDeleteEvent}
										toggleEditMode={toggleEditMode}
									/>
								) : (
									<EventView event={event[0]} promptDeleteEvent={promptDeleteEvent} toggleEditMode={toggleEditMode} />
								)}
							</div>
						)}
					</Transition>
				)}
			</Card>
		</Container>
	);
}
