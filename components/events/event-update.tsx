'use client';

import { EventFetch, EventForm, NotificationUnitOptions, notificationUnitOptions } from '@/types/event';
import { Settings } from '@/types/settings';
import { getBeginningOfDate, getDate, getEndOfDate } from '@/util/time';
import {
	ActionIcon,
	Alert,
	Avatar,
	Button,
	Card,
	Container,
	Divider,
	Flex,
	Group,
	NumberInput,
	rem,
	Select,
	Stack,
	Switch,
	Text,
	TextInput,
	Transition,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCalendarCheck, FaChevronDown, FaExclamation, FaQuestionCircle } from 'react-icons/fa';
import AddLabel from '../add-label';
import { HiX } from 'react-icons/hi';
import { fadeTransition } from '@/util/transition';
import { notify, updateNotification } from '@/util/notifications/notify';
import { compareObjects } from '@/util/comp';
import { useEvents } from '@/hooks/use-events';

type EventUpdateProps = {
	event: EventFetch;
	settings: Settings;

	promptDeleteEvent: () => void;
	toggleEditMode: (mode?: boolean) => void;
};

type CreateLabel = {
	name: string;
	color: string;
	label: string;
};

type UpdateEventState = {
	time: {
		start: {
			current: Date;
			previous: Date;
		};
		end: {
			current: Date;
			previous: Date;
		};
	};
	allDay: boolean;
	label: string;
	addMode: boolean;
	addNotification: boolean;
	notification: {
		duration: number;
		unit: NotificationUnitOptions;
	};
};

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, CreateLabel>(({ name, color, label, ...others }: CreateLabel, ref) => (
	<div ref={ref} {...others}>
		<Group noWrap>
			<Avatar radius='xl' size='sm' style={{ backgroundColor: color }}>
				<></>
			</Avatar>
			<Text>{name}</Text>
		</Group>
	</div>
));

export default function UpdateEvent({ event, settings, promptDeleteEvent, toggleEditMode }: EventUpdateProps) {
	const { updateEvent } = useEvents();
	const [input, setInput] = useState<UpdateEventState>({
		time: {
			start: { current: getDate(event.time.start), previous: getDate(event.time.start) },
			end: { current: getDate(event.time.end), previous: getDate(event.time.end) },
		},
		allDay: event.allDay,
		label: `${settings.events.labels.findIndex((value) => value.name === event.label.name)}`,
		addMode: false,
		addNotification: event.notification.duration !== 0,
		notification: { duration: event.notification.duration, unit: event.notification.unit },
	});

	const router = useRouter();

	const {
		getValues,
		setValue,
		register,
		clearErrors,
		formState: { errors },
	} = useForm<EventForm>({
		defaultValues: {
			name: event.name,
			description: event.description,
			allDay: event.allDay,
			label: { ...event.label },
			notification: { ...event.notification },
			location: event.location,
			time: {
				start: getDate(event.time.start),
				end: getDate(event.time.end),
			},
		},
	});

	const resetFields = () => {
		setValue('name', event.name);
		setValue('description', event.description);
		setValue('allDay', event.allDay);
		setValue('location', event.location);
		setValue('label', event.label);
		setValue('notification', event.notification);
		setValue('time.start', getDate(event.time.start));
		setValue('time.end', getDate(event.time.end));
		setInput({
			allDay: event.allDay,
			label: `${settings.events.labels.findIndex((value) => value.name === event.label.name)}`,
			time: {
				start: { current: getDate(event.time.start), previous: getDate(event.time.start) },
				end: { current: getDate(event.time.end), previous: getDate(event.time.end) },
			},
			addMode: false,
			addNotification: event.notification.duration !== 0,
			notification: { duration: event.notification.duration, unit: event.notification.unit },
		});
	};

	const toggleAllDay = () => {
		setInput((values) => ({
			...values,
			allDay: !values.allDay,
			time: {
				start: {
					previous: values.time.start.current,
					current: values.allDay ? values.time.start.previous : getBeginningOfDate(values.time.start.current),
				},
				end: {
					previous: values.time.end.current,
					current: values.allDay ? values.time.end.previous : getEndOfDate(values.time.end.current),
				},
			},
		}));
	};

	const promptResetChanges = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Resetting changes',
			children: (
				<Container>
					<Alert
						icon={<FaExclamation />}
						title='Are you sure you want to reset?'
						color='yellow'
						radius='xs'
						mb={rem(4)}>
						This action cannot be undone
					</Alert>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green' },
			onConfirm: () => {
				resetFields();
			},
		});
	};

	const promptUpdateEvent = () => {
		console.log(event.label, settings.events.labels[+input.label]);
		const formValues = getValues();
		const noChanges =
			event.name === formValues.name &&
			event.description === formValues.description &&
			event.allDay === input.allDay &&
			event.location === formValues.location &&
			getDate(event.time.start).valueOf() === input.time.start.current.valueOf() &&
			getDate(event.time.end).valueOf() === input.time.end.current.valueOf() &&
			compareObjects(event.label, settings.events.labels[+input.label]) &&
			compareObjects(event.notification, input.notification);
		modals.openConfirmModal({
			centered: true,
			title: 'Updating event',
			children: (
				<Container>
					{noChanges ? (
						<Alert icon={<FaQuestionCircle />} title='No changes were made' color='orange' radius='xs' mb={rem(4)}>
							This event is the same. Please make some changes if you want to update.
						</Alert>
					) : (
						<Alert
							icon={<FaExclamation />}
							title='Do you want to confirm these changes'
							color='yellow'
							radius='xs'
							mb={rem(4)}>
							We do not keep the history of event changes. Confirming these changes are permanent.
						</Alert>
					)}
					<Stack>
						{event.name !== formValues.name && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Name</Text>
								<Text>Old value: {event.name ?? ''}</Text>
								<Text>New value: {formValues.name}</Text>
							</Stack>
						)}
						{event.description !== formValues.description && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Description</Text>
								<Text>Old value: {event.description ?? ''}</Text>
								<Text>New value: {formValues.description}</Text>
							</Stack>
						)}
						{event.allDay !== input.allDay && (
							<Stack spacing='xs'>
								<Text c='dimmed'>All day</Text>
								<Text>Old value: {event.allDay ? 'Yes' : 'No'}</Text>
								<Text>New value: {input.allDay ? 'Yes' : 'No'}</Text>
							</Stack>
						)}
						{getDate(event.time.start).valueOf() !== input.time.start.current.valueOf() && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Start time</Text>
								<Text>Old value: {getDate(event.time.start).toLocaleString()}</Text>
								<Text>New value: {input.time.start.current.toLocaleString()}</Text>
							</Stack>
						)}
						{getDate(event.time.end).valueOf() !== input.time.end.current.valueOf() && (
							<Stack spacing='xs'>
								<Text c='dimmed'>End time</Text>
								<Text>Old value: {getDate(event.time.end).toLocaleString()}</Text>
								<Text>New value: {input.time.end.current.toLocaleString()}</Text>
							</Stack>
						)}
						{event.location !== formValues.location && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Location</Text>
								<Text>Old value: {event.location ?? ''}</Text>
								<Text>New value: {formValues.location}</Text>
							</Stack>
						)}
						{!compareObjects(event.label, settings.events.labels[+input.label]) && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Label</Text>
								<Text>Old value: {event.label.name}</Text>
								<Text>New value: {settings.events.labels[+input.label].name}</Text>
							</Stack>
						)}
						{!compareObjects(event.notification, input.notification) && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Notification</Text>
								<Text>Old value: {`${event.notification.duration} ${event.notification.unit}`}</Text>
								<Text>New value: {`${input.notification.duration} ${input.notification.unit}`}</Text>
							</Stack>
						)}
					</Stack>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green', disabled: noChanges },
			onConfirm: () => {
				setValue('allDay', input.allDay);
				setValue('label', settings.events.labels[+input.label]);
				setValue('notification', input.notification);
				setValue('time.start', input.time.start.current);
				setValue('time.end', input.time.end.current);
				const id = notify(
					`update-event-${event.id}`,
					`Updating event: ${event.name}`,
					'Your data will be loaded',
					true,
					settings,
					'info'
				);
				const result = updateEvent(event, getValues());
				if (result.success) {
					updateNotification(id, 'Success!', 'Successfully updated event', settings, 'success', <FaCalendarCheck />);
					router.push('/events');
				} else {
					updateNotification(id, 'Error!', 'Unable to update event', settings, 'error');
				}
			},
		});
	};

	const promptCancelChanges = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Canceling changes',
			children: (
				<Container>
					<Alert
						icon={<FaExclamation />}
						title='Are you sure you want to cancel changes?'
						color='yellow'
						radius='xs'
						mb={rem(4)}>
						This action cannot be undone
					</Alert>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green', disabled: !event },
			onConfirm: () => {
				resetFields();
				toggleEditMode(false);
			},
		});
	};

	return (
		<div>
			<Card.Section mx={rem(4)} pt={rem(4)}>
				<Flex direction='column' gap='xs'>
					<TextInput
						placeholder='Event name'
						label='Name'
						radius='md'
						size='md'
						withAsterisk
						error={errors.name?.message}
						{...register('name', {
							minLength: {
								value: 5,
								message: 'Minimum length is 5',
							},
						})}
					/>
					<TextInput
						placeholder='Event description'
						label='Description'
						radius='md'
						size='md'
						error={errors.description?.message}
						{...register('description')}
					/>
				</Flex>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section mx={rem(4)} pt={rem(4)}>
				<Group align='top'>
					<div className='flex-1'>
						<Group grow spacing={rem(20)}>
							<DateTimePicker
								withAsterisk
								label='Start time'
								placeholder='Pick date and time'
								valueFormat='MM/DD/YYYY hh:mm A'
								dropdownType='modal'
								modalProps={{ centered: true }}
								minDate={new Date()}
								firstDayOfWeek={0}
								onChange={(e) => {
									if (e) {
										setInput((values) => ({
											...values,
											time: {
												...values.time,
												start: {
													previous: values.time.start.current,
													current: e,
												},
											},
										}));
										clearErrors('time.start');
									}
								}}
								error={errors.time?.start?.message}
								timeInputProps={{ disabled: input.allDay }}
								value={input.time.start.current}
							/>
							<DateTimePicker
								withAsterisk
								label='End time'
								placeholder='Pick date and time'
								valueFormat='MM/DD/YYYY hh:mm A'
								dropdownType='modal'
								modalProps={{ centered: true }}
								minDate={new Date()}
								firstDayOfWeek={0}
								onChange={(e) => {
									if (e) {
										setInput((values) => ({
											...values,
											time: {
												...values.time,
												end: {
													previous: values.time.end.current,
													current: e,
												},
											},
										}));
										clearErrors('time.end');
									}
								}}
								error={errors.time?.end?.message}
								timeInputProps={{ disabled: input.allDay }}
								value={input.time.end.current}
							/>
						</Group>
					</div>
					<Stack spacing={4}>
						<Text size='sm' color='white'>
							All day task
						</Text>
						<Switch
							checked={input.allDay}
							onClick={() => {
								setInput((values) => ({
									...values,
									allDay: !values.allDay,
									time: {
										start: {
											previous: values.time.start.current,
											current: values.allDay
												? values.time.start.previous
												: getBeginningOfDate(values.time.start.current),
										},
										end: {
											previous: values.time.end.current,
											current: values.allDay ? values.time.end.previous : getEndOfDate(values.time.end.current),
										},
									},
								}));
							}}
						/>
					</Stack>
				</Group>
				<Group grow>
					<TextInput
						placeholder='Event location'
						label='Location'
						radius='md'
						size='md'
						error={errors.location?.message}
						{...register('location')}
					/>
				</Group>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section mx={rem(4)} pt={rem(4)}>
				<Group align='end'>
					<div className='flex-1'>
						<Select
							label='Label'
							variant='filled'
							data={
								settings?.events.labels.map((label, i) => {
									return { ...label, label: label.name, value: `${i}` };
								}) ?? []
							}
							disabled={settings?.events.labels.length === 0 ?? true}
							rightSectionWidth={rem(40)}
							rightSection={<FaChevronDown />}
							itemComponent={SelectItem}
							onChange={(value: string | null) => {
								if (value) {
									setInput((values) => ({
										...values,
										label: value,
									}));
								}
							}}
							value={input.label}
						/>
					</div>
					<Button
						color='orange'
						disabled={input.addMode}
						onClick={() => setInput((values) => ({ ...values, addMode: true }))}>
						Add label
					</Button>
				</Group>
				{settings && (
					<AddLabel
						addMode={input.addMode}
						setAddMode={(value: boolean) => setInput((values) => ({ ...values, addMode: value }))}
						labels={settings.events.labels}
						settings={settings}
					/>
				)}
				<Group align='end'>
					<Button
						mt={rem(28)}
						color='orange'
						onClick={() =>
							setInput((values) => ({ ...values, addNotification: true, notification: { ...event.notification } }))
						}
						disabled={input.addNotification}>
						Add notification
					</Button>
					<Transition
						mounted={input.addNotification}
						transition={fadeTransition()}
						duration={200}
						timingFunction='ease'>
						{(styles) => (
							<div style={styles}>
								<Group align='end'>
									<NumberInput
										label='Notification time'
										description=''
										min={0}
										onChange={(num: number) => {
											setInput((values) => ({
												...values,
												notification: {
													...values.notification,
													duration: num,
												},
											}));
										}}
										value={input.notification.duration}
									/>
									<Select
										label='Notification duration'
										data={notificationUnitOptions.map((value, i) => {
											return { value: `${i}`, label: value };
										})}
										onChange={(value: string) =>
											setInput((values) => ({
												...values,
												notification: { ...values.notification, unit: notificationUnitOptions[+value] },
											}))
										}
										value={`${notificationUnitOptions.indexOf(input.notification.unit)}`}
									/>
									<ActionIcon
										color='orange'
										variant='light'
										size='xl'
										radius='xl'
										onClick={() => {
											setInput((values) => ({
												...values,
												addNotification: false,
												notification: {
													duration: 0,
													unit: 'minutes',
												},
											}));
										}}>
										<HiX />
									</ActionIcon>
								</Group>
							</div>
						)}
					</Transition>
				</Group>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section mx={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='green' onClick={promptUpdateEvent}>
						Confirm changes
					</Button>
					<Button color='blue' onClick={promptResetChanges}>
						Reset changes
					</Button>
					<Button color='yellow' onClick={promptCancelChanges}>
						Discard changes
					</Button>
					<Button color='red' onClick={promptDeleteEvent}>
						Delete task
					</Button>
				</Group>
			</Card.Section>
		</div>
	);
}
