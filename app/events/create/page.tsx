'use client';

import { useProtectedRoute } from '@/hooks/auth';
import { useSettings } from '@/hooks/use-settings';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EventForm, NotificationUnitOptions, eventFormSchema, notificationUnitOptions } from '@/types/event';
import { useEvents } from '@/hooks/use-events';
import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Center,
	Container,
	Divider,
	Group,
	LoadingOverlay,
	NumberInput,
	rem,
	Select,
	Stack,
	Switch,
	Text,
	Textarea,
	TextInput,
	Transition,
} from '@mantine/core';
import { getBeginningOfDate, getEndOfDate } from '@/util/time';
import { DateTimePicker } from '@mantine/dates';
import { FaCalendarCheck, FaChevronDown } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import AddLabel from '@/components/add-label';
import { Label } from '@/types/settings';
import { fadeTransition } from '@/util/transition';
import { parse } from '@/types/parse';
import { notify, updateNotification } from '@/util/notifications/notify';

type EventCreateDateProps = {
	start: {
		current: Date | null;
		previous: Date | null;
	};
	end: {
		current: Date | null;
		previous: Date | null;
	};
};

type CreateLabel = {
	name: string;
	color: string;
	label: string;
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

export default function EventCreate() {
	useProtectedRoute();
	const { settings, loading } = useSettings();

	const router = useRouter();

	const [dates, setDates] = useState<EventCreateDateProps>({
		start: { current: null, previous: null },
		end: { current: null, previous: null },
	});
	const [checked, setChecked] = useState<boolean>(false);
	const [addMode, setAddMode] = useState<boolean>(false);

	const [label, setLabel] = useState<string | null>('');

	const [addNotification, setAddNotification] = useState<boolean>(false);

	const {
		clearErrors,
		getValues,
		handleSubmit,
		register,
		setError,
		formState: { errors },
	} = useForm<EventForm>();

	const [notification, setNotification] = useState<{ duration: number; unit: NotificationUnitOptions }>(
		getValues('notification')
	);

	const { createEvent } = useEvents();

	const submit = () => {
		let missing_dates: boolean = false;
		if (!dates.start.current) {
			setError('time.start', { message: 'Start time is required', type: 'required' });
			missing_dates = true;
		}
		if (!dates.end.current) {
			setError('time.end', { message: 'End time is required', type: 'required' });
			missing_dates = true;
		}
		if (missing_dates) {
			return;
		}
		let foundLabel: Label | undefined = label ? settings?.events.labels[+label] : undefined;

		if (!foundLabel) {
			setError('label.name', { message: 'Unknown label' });
			return;
		}

		register('label', { value: foundLabel });

		// We did a check earlier
		dates.start.current && register('time.start', { value: dates.start.current });
		dates.end.current && register('time.end', { value: dates.end.current });
		register('allDay', { value: checked });

		register('notification', { value: notification });

		const parsed = parse<EventForm>(eventFormSchema, getValues());
		console.log(parsed);
		if (parsed.success) {
			const id = notify(
				`create-event-${parsed.data.name}`,
				`Creating event: ${parsed.data.name}`,
				'Your data will be loaded',
				true,
				settings,
				'info'
			);
			const result = createEvent(parsed.data);
			if (result.success) {
				updateNotification(
					id,
					'Success!',
					`Successfully created ${result.data.name}`,
					settings,
					'success',
					<FaCalendarCheck />
				);
				router.push('/events');
			} else {
				updateNotification(id, 'Error!', 'Unable to create event', settings, 'error');
			}
		} else {
			notify(
				`create-event-error-${Date.now().valueOf()}`,
				'Error!',
				'Form data was not valid',
				false,
				settings,
				'error'
			);
		}
	};

	return (
		<Container size='md' px='xs'>
			<form onSubmit={handleSubmit(submit)}>
				<Box pos='relative'>
					<LoadingOverlay
						visible={loading}
						overlayBlur={2}
						transitionDuration={500}
						loaderProps={{ size: 'md', color: 'orange', variant: 'oval' }}
					/>
					{!settings ? (
						<></>
					) : (
						<>
							<Stack>
								<TextInput
									placeholder='Event name'
									label='Name'
									radius='md'
									size='md'
									withAsterisk
									error={errors.name?.message}
									{...register('name', {
										minLength: {
											value: 3,
											message: 'Minimum length is 3',
										},
									})}
								/>
								<Textarea
									placeholder='Event description'
									label='Description'
									radius='md'
									size='md'
									autosize
									minRows={2}
									maxRows={4}
									{...register('description')}
								/>
								<Divider />
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
													setDates((values) => ({
														...values,
														start: { current: e, previous: checked ? e : values.start.current },
													}));
													clearErrors('time.start');
												}}
												error={errors.time?.start?.message}
												timeInputProps={{ disabled: checked }}
												value={dates.start.current}
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
													setDates((values) => ({
														...values,
														end: { current: e, previous: checked ? e : values.end.current },
													}));
													clearErrors('time.end');
												}}
												error={errors.time?.end?.message}
												timeInputProps={{ disabled: checked }}
												value={dates.end.current}
											/>
										</Group>
									</div>
									<Stack spacing={4}>
										<Text size='sm' color='white'>
											All day task
										</Text>
										<Switch
											checked={checked}
											onClick={() => {
												setDates((values) => ({
													start: {
														current: checked
															? values.start.previous
															: values.start.current
															? getBeginningOfDate(values.start.current)
															: null,
														previous: values.start.current,
													},
													end: {
														current: checked
															? values.end.previous
															: values.end.current
															? getEndOfDate(values.end.current)
															: null,
														previous: values.end.current,
													},
												}));
												setChecked((mode) => !mode);
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
								<Divider />
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
											onChange={setLabel}
											value={label}
										/>
									</div>
									<Button color='orange' disabled={addMode} onClick={() => setAddMode(true)}>
										Add label
									</Button>
								</Group>
								{settings && (
									<AddLabel
										addMode={addMode}
										setAddMode={(value: boolean) => setAddMode(value)}
										labels={settings.events.labels}
										settings={settings}
									/>
								)}
								<Group align='end'>
									<Button
										mt={rem(28)}
										color='orange'
										onClick={() => setAddNotification(true)}
										disabled={addNotification}>
										Add notification
									</Button>
									<Transition
										mounted={addNotification}
										transition={fadeTransition()}
										duration={200}
										timingFunction='ease'>
										{(styles) => (
											<div style={styles}>
												<Group align='end'>
													<NumberInput
														label='Notification time'
														description=''
														defaultValue={5}
														step={5}
														min={0}
														onChange={(num: number) => setNotification((values) => ({ ...values, duration: num }))}
													/>
													<Select
														label='Notification duration'
														data={notificationUnitOptions.map((value, i) => {
															return { value: `${i}`, label: value };
														})}
														onChange={(value: string) =>
															setNotification((values) => ({ ...values, unit: notificationUnitOptions[+value] }))
														}
													/>
													<ActionIcon
														color='orange'
														variant='light'
														size='xl'
														radius='xl'
														onClick={() => {
															setNotification({ duration: 0, unit: 'minutes' });
															setAddNotification(false);
														}}>
														<HiX />
													</ActionIcon>
												</Group>
											</div>
										)}
									</Transition>
								</Group>
							</Stack>
							<Center mt={rem(10)}>
								<Button type='submit' color='orange'>
									Create event
								</Button>
							</Center>
						</>
					)}
				</Box>
			</form>
		</Container>
	);
}
