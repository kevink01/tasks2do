'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getFirestore } from 'firebase/firestore';
import { Alert, Card, Container, LoadingOverlay, Transition, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaExclamation, FaTrash } from 'react-icons/fa';

import UpdateTask from '@/components/tasks/task-update';
import TaskView from '@/components/tasks/task-view';
import { useProtectedRoute } from '@/hooks/auth';
import { useUserDocument } from '@/hooks/firestore';
import { useSettings } from '@/hooks/use-settings';
import { useTasks } from '@/hooks/use-tasks';
import { TaskFetch } from '@/types/tasks';
import { notify, updateNotification } from '@/util/notifications/notify';
import { fadeTransition } from '@/util/transition';
import TaskLoadError from './error';

type TaskProps = {
	edit?: boolean;
};

type RequiredTaskProps = Required<TaskProps>;

const defaultProps: RequiredTaskProps = {
	edit: false,
};

function TaskIDPage({ params, propsIn }: { params: { id: string }; propsIn: TaskProps }) {
	useProtectedRoute();
	const { settings, loading } = useSettings();
	const task = useUserDocument<TaskFetch>((user) => doc(getFirestore(), `/users/${user.uid}/tasks/${params.id}`));
	const { deleteTask } = useTasks();

	const props: RequiredTaskProps = { ...defaultProps, ...propsIn };
	const searchParams = useSearchParams();

	const [editMode, setEditMode] = useState<boolean>(props.edit || (searchParams.get('edit') === 'true' ? true : false));
	const [transition, setTransition] = useState<boolean>(false);

	const toggleEditMode = (edit?: boolean) => {
		setTransition(true);
		setTimeout(() => {
			setEditMode((mode) => edit ?? !mode);
			setTransition(false);
		}, 200);
	};

	const promptDeleteTask = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Deleting task',
			children: (
				<Container>
					<Alert icon={<FaExclamation />} title='Are you sure you want to delete?' color='red' radius='xs' mb={rem(4)}>
						This action cannot be undone
					</Alert>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'red', disabled: !task[0] },
			onConfirm: () => {
				if (task[0]) {
					const id = notify(
						`delete-task-${task[0].id}`,
						`Deleting task: ${task[0].name}`,
						'Your data will be loaded',
						true,
						settings,
						'info'
					);
					const result = deleteTask(task[0]);
					if (result.success) {
						updateNotification(id, 'Success!', 'Successfully deleted task', settings, 'success', <FaTrash />);
					} else {
						updateNotification(id, 'Error!', 'Unable to delete task', settings, 'error');
					}
				} else {
					notify(`delete-task-${task[0]!.id}-null`, 'Error', 'Task is null', false, settings, 'error');
				}
			},
		});
	};

	return (
		<>
			<Container size='md' px='xs' pt='lg'>
				<Card shadow='sm' padding='sm' radius='md' withBorder className='relative'>
					<LoadingOverlay
						visible={(!task[0] && task[1]) || loading}
						overlayBlur={2}
						transitionDuration={500}
						loaderProps={{ size: 'md', color: 'orange', variant: 'oval' }}
					/>
					{!task[0] && task[3] && !task[3].exists() ? (
						<TaskLoadError />
					) : editMode ? (
						<Transition mounted={!transition} transition={fadeTransition()} duration={200} timingFunction='ease'>
							{(styles) => (
								<div style={styles}>
									{task[0] && settings && (
										<UpdateTask
											task={task[0]}
											settings={settings}
											promptDeleteTask={promptDeleteTask}
											toggleEditMode={toggleEditMode}
										/>
									)}
								</div>
							)}
						</Transition>
					) : (
						<Transition mounted={!transition} transition={fadeTransition()} duration={200} timingFunction='ease'>
							{(styles) => (
								<div style={styles}>
									{task[0] && settings && (
										<TaskView task={task[0]} promptDeleteTask={promptDeleteTask} toggleEditMode={toggleEditMode} />
									)}
								</div>
							)}
						</Transition>
					)}
				</Card>
			</Container>
		</>
	);
}

export default TaskIDPage;
