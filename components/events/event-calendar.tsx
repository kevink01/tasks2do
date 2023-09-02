'use client';

import { EventFetch } from '@/types/event';

type EventCalendarProps = {
	events: EventFetch[];
};

export default function EventCalendar({ events }: EventCalendarProps) {
	return <div>EventCalendar</div>;
}
