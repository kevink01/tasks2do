import { collection, deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { useIsAuthenticated } from './auth';
import { useUserCollection } from './firestore';
import { Task, TaskFetch, TaskForm, taskFetchSchema, taskSchema } from '@/types/task';
import { parse } from '@/types/parse';
import { FirebaseResult } from '@/types/firebase';
import { getDate } from '@/util/time';

type TasksInstance = {
	tasks: TaskFetch[] | null;
	createTask: (task: TaskForm) => FirebaseResult<Task>;
	updateTask: (oldTask: TaskFetch, taskForm: TaskForm) => FirebaseResult<Task>;
	markComplete: (task: TaskFetch, checked: boolean) => FirebaseResult<Task>;
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
			const parsed = parse<Task>(taskSchema, { ...task, id: id, createdAt: now, updatedAt: now });
			if (parsed.success) {
				setDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${parsed.data.id}`), parsed.data);
				return { success: true, data: parsed.data };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	function updateTask(oldTask: TaskFetch, taskForm: TaskForm): FirebaseResult<Task> {
		if (user) {
			const now = new Date();
			const parsed = parse<Task>(taskSchema, {
				...oldTask,
				...taskForm,
				completedDate: taskForm.isCompleted ? now : null,
				createdAt: getDate(oldTask.createdAt),
				updatedAt: now,
			});
			if (parsed.success) {
				setDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${oldTask.id}`), parsed.data);
				return { success: true, data: parsed.data };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	function markComplete(task: TaskFetch, checked: boolean): FirebaseResult<Task> {
		if (user) {
			const formValues: TaskForm = {
				...task,
				isCompleted: checked,
				dueDate: getDate(task.dueDate),
				completedDate: checked ? new Date() : null,
			};
			return updateTask(task, formValues);
		}
		return { success: false, error: 'User not logged in' };
	}

	function deleteTask(task: TaskFetch): FirebaseResult<undefined> {
		if (user) {
			const parsed = parse<TaskFetch>(taskFetchSchema, task);
			if (parsed.success) {
				deleteDoc(doc(getFirestore(), `/users/${user.uid}/tasks/${parsed.data.id}`));
				return { success: true, data: undefined };
			} else {
				return { success: false, error: 'Parsed data was not successful' };
			}
		}
		return { success: false, error: 'User not logged in' };
	}

	return { tasks, createTask, updateTask, markComplete, deleteTask };
}
