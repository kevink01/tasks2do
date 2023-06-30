import { collection, deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { useIsAuthenticated } from './auth';
import { useUserCollection } from './firestore';
import { Task, TaskFetch, TaskForm, taskFetchSchema, taskSchema } from '@/types/tasks';
import { parse } from '@/types/parse';
import { FirebaseResult } from '@/types/firebase';

type TasksInstance = {
	tasks: TaskFetch[] | null;
	createTask: (task: TaskForm) => FirebaseResult<Task>;
	updateTask: (task: Task) => void;
	deleteTask: (task: TaskFetch) => FirebaseResult<undefined>;
};

export function useTasks(): TasksInstance {
	const { user } = useIsAuthenticated();

	const tasks =
		useUserCollection<TaskFetch[]>((user) => collection(getFirestore(), 'users', user.uid, 'tasks'))[0] ?? null;

	function createTask(task: TaskForm): FirebaseResult<Task> {
		if (user) {
			const id = uuid();
			const now = new Date();
			const parsed = parse<Task>(taskSchema, { ...task, id: id, created: now, updated: now });
			if (parsed.success) {
				setDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${parsed.data.id}`), parsed.data);
				return { success: true, data: parsed.data };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	function updateTask(task: Task) {
		if (user) {
			setDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${task.id}`), task);
		}
	}

	function deleteTask(task: TaskFetch): FirebaseResult<undefined> {
		if (user) {
			const result = parse<TaskFetch>(taskFetchSchema, task);
			if (result.success) {
				deleteDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${result.data.id}`));
				return { success: true, data: undefined };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	return { tasks, createTask, updateTask, deleteTask };
}
