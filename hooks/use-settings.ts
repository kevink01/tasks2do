import { FirebaseResult } from '@/types/firebase';
import { Settings } from '@/types/settings';
import { useIsAuthenticated } from './auth';
import { useUserDocument } from './firestore';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { User, userSchema } from '@/types/user';
import { parse } from '@/types/parse';

type SettingsInstance = {
	settings: Settings | null;
	loading: boolean;
	updateSettings: (settingsForm: Settings) => FirebaseResult<User>;
	// defaultSettings: () => FirebaseResult<undefined>;
};

export function useSettings(): SettingsInstance {
	const { user } = useIsAuthenticated();
	const data = useUserDocument<User>((user) => doc(getFirestore(), 'users', user.uid));
	const settings = data[0]?.settings ?? null;

	function updateSettings(settingsForm: Settings): FirebaseResult<User> {
		if (user && data) {
			const parsed = parse<User>(userSchema, {
				...data[0],
				settings: settingsForm,
			});
			if (parsed.success) {
				setDoc(doc(getFirestore(), `users/${user.uid}`), parsed.data);
				return { success: true, data: parsed.data };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	return { settings, loading: data[1], updateSettings };
}
