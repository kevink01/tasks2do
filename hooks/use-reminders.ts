import { Reminder, ReminderFetch, ReminderForm, reminderSchema } from '@/types/reminder';
import { useIsAuthenticated } from './auth';
import { useUserCollection } from './firestore';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { FirebaseResult } from '@/types/firebase';
import { v4 as uuid } from 'uuid';
import { parse } from '@/types/parse';

type RemindersInstance = {
	reminders: ReminderFetch[] | null;
	createReminder: (reminder: ReminderForm) => FirebaseResult<Reminder>;
};

export default function useReminders(): RemindersInstance {
	const { user } = useIsAuthenticated();

	const reminders =
		useUserCollection<ReminderFetch[]>((user) => collection(getFirestore(), 'users', user.uid, 'reminders'))[0] ?? null;

	function createReminder(reminder: ReminderForm): FirebaseResult<Reminder> {
		if (user) {
			const id = uuid();
			const now = new Date();

			const parsed = parse<Reminder>(reminderSchema, { ...reminder, id: id, created: now, updated: now });
			if (parsed.success) {
				setDoc(doc(getFirestore(), `/users/${user.uid}/reminders/${parsed.data.id}`), parsed.data);
				return { success: true, data: parsed.data };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	return { reminders, createReminder };
}
