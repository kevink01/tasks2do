'use client';

import { useState } from 'react';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { v4 as uuid } from 'uuid';
import { useIsAuthenticated } from '@/hooks/auth';

type AccordionOpen = 'tasks' | 'reminders' | 'events' | 'none';

function Dashboard() {
	// TODO Redo dashboard with Mantine
	const { user, loading, error } = useIsAuthenticated();
	const [open, setOpen] = useState<AccordionOpen>('tasks');

	const [data, dataLoading, dataError] = useCollectionData(
		collection(getFirestore(), 'users', user?.uid ?? 'none', 'tasks')
	);

	const addCollection = async () => {
		const id = uuid();
		await setDoc(doc(getFirestore(), `users/${user!.uid}/tasks/${id}`), {
			name: 'Test',
			id: id,
			description: 'My description',
			timestamp: serverTimestamp(),
		});
	};
	return (
		<>
			{dataLoading ? (
				<div>Loading</div>
			) : (
				<>
					{data && data.length > 0 ? (
						<>{/* TODO: Data dispaly*/}</>
					) : (
						<div className='flex flex-col space-y-4'>
							<span>Sad</span>
						</div>
					)}{' '}
					<button className='btn btn-primary w-40' onClick={addCollection}>
						Add me
					</button>
				</>
			)}
		</>
	);
}

export default Dashboard;
