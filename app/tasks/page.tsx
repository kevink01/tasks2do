'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Accordion,
	ActionIcon,
	Box,
	Button,
	Center,
	Container,
	Grid,
	Group,
	Indicator,
	Stack,
	Text,
	Tooltip,
	Transition,
	rem,
} from '@mantine/core';
import { FaCalendar, FaTable } from 'react-icons/fa';
import { useProtectedRoute } from '@/hooks/auth';
import { useTasks } from '@/hooks/use-tasks';
import { TaskFetch } from '@/types/tasks';
import { getBeginningOfDay } from '@/util/time';
import CustomLink from '@/components/custom-link';
import { TasksGridLoader } from './loading';
import NoTasks from '@/components/tasks/no-tasks';
import { Calendar } from '@mantine/dates';
import TaskInfo from '@/components/tasks/task-info';
import TaskCard from '@/components/tasks/task-card';

type SelectedDate = {
	date: Date | null;
	tasks: TaskFetch[];
};

const opacity = {
	in: { opacity: 1, transform: 'scaleX(1)' },
	out: { opacity: 0, transform: 'scaleX(0)' },
	common: { transformOrigin: 'left' },
	transitionProperty: 'transform, opacity',
};

function Tasks() {
	useProtectedRoute();
	const { tasks } = useTasks();
	const router = useRouter();

	const [calendarMode, setCalenderMode] = useState<boolean>(false);
	const [days, setDays] = useState<number[]>([]);
	const [selectedDate, setSelectedDate] = useState<SelectedDate>({ date: null, tasks: [] });

	const toggleCalendarMode = () => {
		setCalenderMode((mode) => !mode);
	};

	const handleSelectDate = (date: Date) => {
		if (selectedDate.date && selectedDate.date.valueOf() === date.valueOf()) {
			setSelectedDate({ date: null, tasks: [] });
		} else {
			if (tasks) {
				const dateTasks = tasks.filter((task) => getBeginningOfDay(task.complete).valueOf() === date.valueOf());
				setSelectedDate({ ...selectedDate, date: null });
				setTimeout(() => {
					setSelectedDate({ date: date, tasks: dateTasks });
				}, 200);
			} else {
				setSelectedDate({ date: date, tasks: [] });
			}
		}
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
				<Container size='sm' px='xs'>
					<Stack>
						<Center>
							<Calendar
								size='md'
								renderDay={(date) => {
									return (
										<Indicator color='red' offset={-2} disabled={!days.includes(date.valueOf())}>
											<div>{date.getDate()}</div>
										</Indicator>
									);
								}}
								getDayProps={(date) => ({
									onClick: () => handleSelectDate(date),
								})}
							/>
						</Center>
						<Accordion value={selectedDate.date && 'tasks'}>
							<Accordion.Item value='tasks'>
								<Accordion.Control disabled={!selectedDate.date}>
									<Group>
										<Text>Tasks for date:</Text>
										<Transition
											mounted={selectedDate.date !== null}
											transition={opacity}
											duration={200}
											timingFunction='ease'>
											{(styles) => (
												<Text style={styles}>
													{selectedDate.date ? ` ${selectedDate.date.toLocaleDateString()}` : ''}
												</Text>
											)}
										</Transition>
									</Group>
								</Accordion.Control>
								<Accordion.Panel>
									{selectedDate.tasks.length === 0 ? (
										<div>No tasks</div>
									) : (
										<Stack spacing='xs' align='left'>
											{selectedDate.tasks.map((task) => {
												return <TaskInfo task={task} key={task.id} />;
											})}
										</Stack>
									)}
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					</Stack>
				</Container>
			) : (
				<Grid gutter={5}>
					{tasks.map((task) => {
						return <TaskCard key={task.id} task={task} router={router} />;
					})}
				</Grid>
			)}
		</Container>
	);
}

export default Tasks;
