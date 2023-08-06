'use client';

import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Center,
	Container,
	Flex,
	LoadingOverlay,
	Notification,
	NumberInput,
	Select,
	Stack,
	Switch,
	Tabs,
	Text,
} from '@mantine/core';
import { useForm } from 'react-hook-form';

import { useProtectedRoute } from '@/hooks/auth';
import { useSettings } from '@/hooks/use-settings';
import { NotificationTheme, Settings, notificationThemeOptions } from '@/types/settings';
import { defaultSettings } from '@/util/default';
import { notify, updateNotification } from '@/util/notifications/notify';
import { capitalize } from '@/util/text';
import { FaCheck, FaInfo } from 'react-icons/fa';
import { notifications } from '@mantine/notifications';

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
		if (checked) {
			notifications.clean();
			notify(`test-notification-${Date.now().valueOf}`, 'Test', 'Notification test', false, values, 'info');
		}
	};

	const submit = () => {
		setValue('notification.enabled', checked);
		const id = notify('update-settings', 'Updating settings', 'Waiting for response...', true, settings, 'info');
		const result = updateSettings(getValues());
		if (result.success) {
			updateNotification(id, 'Success!', 'Successfully updated settings', settings, 'success', <FaCheck />);
		} else {
			updateNotification(id, 'Error!', 'Unable to update settings', settings, 'error');
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

											<Stack spacing='xs'>
												<Notification title='Example notification' withCloseButton={false}>
													Lorem ipsum dolor sit amet, consectetur adipisicing elit.
												</Notification>
												<Notification
													icon={<FaInfo />}
													title='Example notification'
													styles={{
														root: {
															backgroundColor: getValues().notification.theme === 'dark' ? 'black' : 'green',
														},
													}}
													withCloseButton={false}>
													Lorem ipsum dolor sit amet, consectetur adipisicing elit.
												</Notification>
												<Notification loading title='Example notification' withCloseButton={false}>
													Lorem ipsum dolor sit amet, consectetur adipisicing elit.
												</Notification>
											</Stack>
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
