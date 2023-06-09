'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, ActionIcon, Box, Button, Container, Grid, Tooltip, Transition, rem } from '@mantine/core';
import { FaCalendar, FaTable } from 'react-icons/fa';
import CustomLink from '@/components/custom-link';
import NoTasks from '@/components/tasks/no-tasks';
import TaskCard from '@/components/tasks/task-card';
import TaskCalender from '@/components/tasks/task-calendar';
import { useProtectedRoute } from '@/hooks/auth';
import { useTasks } from '@/hooks/use-tasks';
import { getBeginningOfDay } from '@/util/time';
import { fadeTransition } from '@/util/transition';
import { TasksGridLoader } from './loading';

function Tasks() {
	useProtectedRoute();
	const { tasks } = useTasks();
	const router = useRouter();

	const [calendarMode, setCalenderMode] = useState<boolean>(false);
	const [days, setDays] = useState<number[]>([]);
	const [transition, setTransition] = useState<boolean>(false);

	const toggleCalendarMode = () => {
		setTransition(true);
		setTimeout(() => {
			setCalenderMode((mode) => !mode);
			setTransition(false);
		}, 200);
	};

	useEffect(() => {
		if (!tasks) return;
		setDays(
			tasks.map((task) => {
				return getBeginningOfDay(task.complete).valueOf();
			})
		);
	}, [tasks]);

	return (
		<Container size='lg' px='xs'>
			<Accordion defaultValue='tasks' pb={rem(10)}>
				<Accordion.Item value='tasks'>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: rem(10) }}>
						<Accordion.Control>Tasks</Accordion.Control>
						<CustomLink href='/tasks/create'>
							<Button color='orange'>Create task</Button>
						</CustomLink>
						<Tooltip
							label={calendarMode ? 'Table mode' : 'Calendar mode'}
							color='orange'
							position='bottom'
							withArrow
							arrowPosition='center'
							events={{ hover: true, focus: true, touch: false }}>
							<ActionIcon color='orange' size='xl' radius='xl' variant='light' onClick={toggleCalendarMode}>
								{calendarMode ? <FaTable /> : <FaCalendar />}
							</ActionIcon>
						</Tooltip>
					</Box>
					<Accordion.Panel>Description</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
			{!tasks ? (
				<TasksGridLoader />
			) : tasks.length === 0 ? (
				<NoTasks />
			) : calendarMode ? (
				<Transition mounted={!transition} transition={fadeTransition()} duration={200} timingFunction='ease'>
					{(styles) => (
						<div style={styles}>
							<TaskCalender days={days} tasks={tasks} />
						</div>
					)}
				</Transition>
			) : (
				<Transition mounted={!transition} transition={fadeTransition()} duration={200} timingFunction='ease'>
					{(styles) => (
						<div style={styles}>
							<Grid gutter={5}>
								{tasks.map((task) => {
									return <TaskCard key={task.id} task={task} router={router} />;
								})}
							</Grid>
						</div>
					)}
				</Transition>
			)}
		</Container>
	);
}

export default Tasks;
