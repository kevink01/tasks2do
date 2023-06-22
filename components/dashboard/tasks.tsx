'use client';

import { collection, doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { v4 as uuid } from 'uuid';
import { useIsAuthenticated } from '@/hooks/auth';
import { TaskLoader } from '@/app/dashboard/loading';
import { Accordion } from '@mantine/core';

type Test = {
	name: string;
	id: string;
	description: string;
	timestamp: Date;
};

function Tasks() {
	const { user, error } = useIsAuthenticated();
	const [data, dataLoading, dataError] = useCollection(
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
				<TaskLoader />
			) : (
				<Accordion.Item value='tasks'>
					<Accordion.Control>Tasks</Accordion.Control>
					<Accordion.Panel>
						{data && data.size > 0 ? (
							data.docs.map((doc) => {
								return <div key={doc.id}>{doc.get('name')}</div>;
							})
						) : (
							<>Add data</>
						)}
					</Accordion.Panel>
				</Accordion.Item>
			)}
		</>
	);
}

export default Tasks;
