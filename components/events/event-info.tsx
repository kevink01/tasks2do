import { EventFetch } from '@/types/event';
import { Divider, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import CustomLink from '../custom-link';
import { getDate, getTime } from '@/util/time';

type EventInfoProps = {
	event: EventFetch;
};

export default function EventInfo({ event }: EventInfoProps) {
	return (
		<Group>
			<Divider size='xl' orientation='vertical' color='purple' />
			<div className='flex-1'>
				<Stack spacing='xs'>
					<Group>
						<div className='flex-1'>
							<CustomLink href={`/tasks/${event.id}`}>
								<Title order={4} td='underline'>
									{event.name}
								</Title>
							</CustomLink>
						</div>
						<Text>{event.allDay ? 'All day' : getTime(getDate(event.time.start))}</Text>
					</Group>
					<Text>{event.description}</Text>
				</Stack>
			</div>
		</Group>
	);
}
