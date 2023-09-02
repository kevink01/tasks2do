import { Label, Settings, labelSchema, settingsSchema } from '@/types/settings';
import { FirebaseResult } from '@/types/firebase';
import { useIsAuthenticated } from '@/hooks/auth';
import { parse } from '@/types/parse';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { User, userSchema } from '@/types/user';
import { useUserDocument } from '@/hooks/firestore';

type LabelsInstance = {
	updateLabels: (oldLabels: Label[], newLabel: Label) => FirebaseResult<Label[]>;
};

export default function useLabels(): LabelsInstance {
	const { user } = useIsAuthenticated();
	const data = useUserDocument<User>((user) => doc(getFirestore(), 'users', user.uid));

	function updateLabels(oldLabels: Label[], newLabel: Label): FirebaseResult<Label[]> {
		if (user && data) {
			oldLabels.push(newLabel);
			const result = parse<User>(userSchema, {
				...data[0],
				settings: { ...data[0]?.settings, events: { labels: oldLabels } },
			});
			if (result.success) {
				setDoc(doc(getFirestore(), `/users/${user.uid}`), result.data);
				return { success: true, data: oldLabels };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	return { updateLabels };
}
