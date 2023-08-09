import { Divider, Group, Stack, Text, Title } from '@mantine/core';

import { ReminderFetch } from '@/types/reminder';
import { getDate, getTime } from '@/util/time';
import CustomLink from '../custom-link';

type ReminderInfoProps = {
	reminder: ReminderFetch;
};

export default function ReminderInfo({ reminder }: ReminderInfoProps) {
	return (
		<Group>
			<Divider size='xl' orientation='vertical' color='yellow' />
			<div className='flex-1'>
				<Stack spacing='xs'>
					<Group>
						<div className='flex-1'>
							<CustomLink href={`/tasks/${reminder.id}`}>
								<Title order={4} td='underline'>
									{reminder.name}
								</Title>
							</CustomLink>
						</div>
						<Text>{reminder.allDay ? 'All day' : getTime(getDate(reminder.complete))}</Text>
					</Group>
					<Text>{reminder.description}</Text>
				</Stack>
			</div>
		</Group>
	);
}
