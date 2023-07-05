'use client';

import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Center,
	Container,
	Flex,
	LoadingOverlay,
	NumberInput,
	Select,
	Stack,
	Switch,
	Tabs,
	Text,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useProtectedRoute } from '@/hooks/auth';
import { useSettings } from '@/hooks/use-settings';
import {
	NotificationLocation,
	NotificationTheme,
	Settings,
	notificationLocationOptions,
	notificationThemeOptions,
} from '@/types/settings';
import { defaultSettings } from '@/util/default';
import { notify } from '@/util/notify';
import { capitalize } from '@/util/text';

function UserSettings() {
	useProtectedRoute();

	const { settings, loading, updateSettings } = useSettings();

	const { getValues, handleSubmit, setValue } = useForm<Settings>({
		defaultValues: defaultSettings,
	});

	const [form, setForm] = useState<boolean>(false);
	const [tabs, setTabs] = useState<string[]>([]);
	const [checked, setChecked] = useState<boolean>(false);

	const testNotify = () => {
		const values = getValues();
		console.log(values);
		if (checked) {
			toast('Testing a message', {
				autoClose: values.notification.duration * 1000,
				position: values.notification.location,
				theme: values.notification.theme,
				type: 'success',
			});
		}
	};

	const submit = () => {
		setValue('notification.enabled', checked);
		const result = updateSettings(getValues());
		if (result.success) {
			notify('Successfully updated settings', settings, 'success');
		} else {
			notify('Unable to update settings', settings, 'error');
		}
	};

	useEffect(() => {
		if (settings) {
			setTabs(Object.keys(settings));
			setValue('notification', settings.notification);
			setChecked(settings.notification.enabled);
			setForm(true);
		}
	}, [setValue, settings]);

	return (
		<Container size='md' px='xs'>
			<form onSubmit={handleSubmit(submit)}>
				<Box pos='relative'>
					<LoadingOverlay
						visible={loading && !form}
						overlayBlur={2}
						transitionDuration={500}
						loaderProps={{ size: 'md', color: 'orange', variant: 'oval' }}
					/>
					{!form ? (
						<div>Loading</div>
					) : !settings ? (
						<div>Error</div>
					) : (
						<div>
							<Tabs defaultValue={tabs[0]} orientation='vertical' variant='pills' color='orange'>
								<Tabs.List>
									<Stack spacing='xs'>
										{tabs.map((tab) => {
											return (
												<Tabs.Tab key={`settings-${tab}`} value={tab}>
													{capitalize(tab)}
												</Tabs.Tab>
											);
										})}
									</Stack>
								</Tabs.List>

								<Tabs.Panel value='notification'>
									<Container size='md' px='xl'>
										<Stack spacing='xs'>
											<Flex align='flex-end'>
												<div className='flex-1'>
													<Stack spacing={0}>
														<Text size='sm' color='white'>
															Enable notifications
														</Text>
														<Switch
															checked={checked}
															onClick={() => {
																setChecked((mode) => !mode);
															}}
														/>
													</Stack>
												</div>
												<Button onClick={testNotify} disabled={!checked}>
													Test notification
												</Button>
											</Flex>
											<Select
												label='Notification theme'
												placeholder='Select a theme'
												data={notificationThemeOptions.map((value) => {
													return { label: value, value: value };
												})}
												defaultValue={getValues().notification.theme}
												onChange={(value) => {
													if (value) {
														setValue('notification.theme', value as NotificationTheme);
													}
												}}
												transitionProps={{ transition: 'pop-top-left', duration: 200, timingFunction: 'ease' }}
												disabled={!checked}
											/>
											<NumberInput
												label='Notification duration'
												placeholder='2'
												defaultValue={getValues().notification.duration}
												min={1}
												max={5}
												onChange={(value) => {
													if (value !== '') {
														setValue('notification.duration', value);
													}
												}}
												disabled={!checked}
											/>
											<Select
												label='Notification location'
												placeholder='Select a location'
												data={notificationLocationOptions.map((value) => {
													return { label: value, value: value };
												})}
												defaultValue={getValues().notification.location}
												onChange={(value) => {
													if (value) {
														setValue('notification.location', value as NotificationLocation);
													}
												}}
												disabled={!checked}
												transitionProps={{ transition: 'pop-top-left', duration: 200, timingFunction: 'ease' }}
											/>
											<Center>
												<Button type='submit'>Update settings</Button>
											</Center>
										</Stack>
									</Container>
								</Tabs.Panel>
								<Tabs.Panel value='messages'>Messages tab content</Tabs.Panel>
								<Tabs.Panel value='settings'>Settings tab content</Tabs.Panel>
							</Tabs>
						</div>
					)}
				</Box>
			</form>
		</Container>
	);
}

export default UserSettings;
