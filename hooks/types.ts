import { collection, deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { useIsAuthenticated } from './auth';
import { useUserCollection } from './firestore';

type TasksInstance = {
	tasks: Task[] | null;
	createTask: (task: Task) => void;
	updateTask: (task: Task) => void;
	deleteTask: (task: Task) => void;
};

export function useTasks(): TasksInstance {
	const { user } = useIsAuthenticated();

	const tasks = useUserCollection<Task[]>((user) => collection(getFirestore(), 'users', user.uid, 'tasks'))[0] ?? null;

	function createTask(task: Task) {
		if (user) {
			const id = uuid();
			setDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${id}`), task);
		}
	}

	function updateTask(task: Task) {
		if (user) {
			setDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${task.id}`), task);
		}
	}

	function deleteTask(task: Task) {
		if (user) {
			console.log(task);
			deleteDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${task.id}`));
		}
	}

	return { tasks, createTask, updateTask, deleteTask };
}
