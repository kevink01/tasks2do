import { Event, EventFetch, EventForm, eventSchema } from '@/types/event';
import { FirebaseResult } from '@/types/firebase';
import { useIsAuthenticated } from '@/hooks/auth';
import { useUserCollection } from '@/hooks/firestore';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { parse } from '@/types/parse';

type EventsInstance = {
	events: EventFetch[] | null;
	createEvent: (event: EventForm) => FirebaseResult<Event>;

	// updateEvent: (oldEvent: EventFetch, eventForm: EventForm) => FirebaseResult<Event>;
	// deleteEvent: (event: EventFetch) => FirebaseResult<undefined>;
};

export function useEvents(): EventsInstance {
	const { user } = useIsAuthenticated();

	const events =
		useUserCollection<EventFetch[]>((user) => collection(getFirestore(), 'users', user.uid, 'events'))[0] ?? null;

	function createEvent(event: EventForm): FirebaseResult<Event> {
		if (user) {
			const id = uuid();
			const now = new Date();

			const parsed = parse<Event>(eventSchema, { ...event, id: id, createdAt: now, updatedAt: now });
			if (parsed.success) {
				setDoc(doc(getFirestore(), `/users/${user.uid}/events/${parsed.data.id}`), parsed.data);
				return { success: true, data: parsed.data };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	return { events, createEvent };
}
