import { Reminder, ReminderFetch, ReminderForm, reminderFetchSchema, reminderSchema } from '@/types/reminder';
import { useIsAuthenticated } from './auth';
import { useUserCollection } from './firestore';
import { collection, deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { FirebaseResult } from '@/types/firebase';
import { v4 as uuid } from 'uuid';
import { parse } from '@/types/parse';
import { getDate } from '@/util/time';

type RemindersInstance = {
	reminders: ReminderFetch[] | null;
	createReminder: (reminder: ReminderForm) => FirebaseResult<Reminder>;
	updateReminder: (oldReminder: ReminderFetch, reminderForm: ReminderForm) => FirebaseResult<Reminder>;
	deleteReminder: (reminder: ReminderFetch) => FirebaseResult<undefined>;
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

	function updateReminder(oldReminder: ReminderFetch, reminderForm: ReminderForm): FirebaseResult<Reminder> {
		if (user) {
			const now = new Date();
			const parsed = parse<Reminder>(reminderSchema, {
				...oldReminder,
				...reminderForm,
				created: getDate(oldReminder.created),
				updated: now,
			});

			if (parsed.success) {
				setDoc(doc(getFirestore(), `/users/${user.uid}/reminders/${oldReminder.id}`), parsed.data);
				return { success: true, data: parsed.data };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	function deleteReminder(reminder: ReminderFetch): FirebaseResult<undefined> {
		if (user) {
			const parsed = parse<ReminderFetch>(reminderFetchSchema, reminder);
			if (parsed.success) {
				deleteDoc(doc(getFirestore(), `/users/${user.uid}/reminders/${parsed.data.id}`));
				return { success: true, data: undefined };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	return { reminders, createReminder, updateReminder, deleteReminder };
}
