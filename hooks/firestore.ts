import { User } from 'firebase/auth';
import { CollectionReference, DocumentReference, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { useIsAuthenticated } from './auth';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

export function useUserCollection<T>(callback: (user: User) => CollectionReference) {
	const { user } = useIsAuthenticated();

	return useCollectionData(user && callback(user)) as [
		T | undefined,
		boolean,
		Error | undefined,
		QuerySnapshot<T> | undefined
	];
}

export function useUserDocument<T>(callback: (user: User) => DocumentReference) {
	const { user } = useIsAuthenticated();

	return useDocumentData(user && callback(user)) as [
		T | undefined,
		boolean,
		Error | undefined,
		DocumentSnapshot<T> | undefined
	];
}
