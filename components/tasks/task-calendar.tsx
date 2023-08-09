import { useState } from 'react';
import { Accordion, Button, Center, Container, Group, Indicator, Space, Stack, Text, Transition } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';

import { TaskFetch } from '@/types/task';
import { getBeginningOfDay } from '@/util/time';
import { scaleTransition } from '@/util/transition';
import TaskInfo from './task-info';
import CustomLink from '../custom-link';

type DateTasks = {
	date: Date | null;
	tasks: TaskFetch[];
};

type TaskCalendarProps = {
	tasks: TaskFetch[];
};

function filterTasks(tasks: TaskFetch[], date: Date): TaskFetch[] {
	return tasks
		.filter((task) => getBeginningOfDay(task.complete).valueOf() === date.valueOf())
		.sort((task1, task2) => {
			const task1Time = task1.complete.seconds + task1.complete.nanoseconds / 1000000;
			const task2Time = task2.complete.seconds + task2.complete.nanoseconds / 1000000;
			return task1Time - task2Time || task1.name > task2.name ? 1 : task1.name < task2.name ? -1 : 0;
		});
}

function TaskCalender({ tasks }: TaskCalendarProps) {
	const today = dayjs(Date.now());
	const days = tasks.map((task) => {
		return getBeginningOfDay(task.complete).valueOf();
	});
	const [dateTasks, setDateTasks] = useState<DateTasks>({
		date: null,
		tasks: filterTasks(tasks, today.toDate()),
	});
	const [open, setOpen] = useState<boolean>(true);

	const opacity = scaleTransition('X');

	const handleSelectDate = (date: Date) => {
		if (dateTasks.date && dateTasks.date.valueOf() === date.valueOf()) {
			setOpen((mode) => !mode);
			setDateTasks({ tasks: [], date: null });
		} else {
			if (tasks) {
				const filteredTasks = filterTasks(tasks, date);
				if (dateTasks.date !== null) {
					setDateTasks({ ...dateTasks, date: null });
					setOpen(false);
					setTimeout(() => {
						setDateTasks({ date: date, tasks: filteredTasks });
					}, 200);
				} else {
					setDateTasks({ date: date, tasks: filteredTasks });
				}
			} else {
				setDateTasks({ date: date, tasks: [] });
			}
			setOpen(true);
		}
	};

	return (
		<Container size='sm' px='xs'>
			<Stack>
				<Space h='xs' />
				<Center>
					<Group spacing='md'>
						<Group spacing='xs'>
							<Indicator color='green'>
								<></>
							</Indicator>
							<Text>Today</Text>
						</Group>
						<Group spacing='xs'>
							<Indicator color='blue'>
								<></>
							</Indicator>
							<Text>Selected date</Text>
						</Group>
						<Group spacing='xs'>
							<Indicator color='red'>
								<></>
							</Indicator>
							<Text>Task</Text>
						</Group>
					</Group>
				</Center>
				<Center>
					<Calendar
						size='md'
						firstDayOfWeek={0}
						renderDay={(date) => {
							if (Math.floor(dayjs(dateTasks.date).diff(date, 'd', true)) === 0) {
								return (
									<Indicator color={days.includes(date.valueOf()) ? 'red' : 'blue'} offset={-2}>
										<div>{date.getDate()}</div>
									</Indicator>
								);
							}
							if (Math.floor(today.diff(date, 'd', true)) === 0) {
								return (
									<Indicator color={days.includes(date.valueOf()) ? 'red' : 'green'} offset={-2}>
										<div>{date.getDate()}</div>
									</Indicator>
								);
							}
							return (
								<Indicator color='red' offset={-2} disabled={!days.includes(date.valueOf())}>
									<div>{date.getDate()}</div>
								</Indicator>
							);
						}}
						getDayProps={(date) => ({
							onClick: () => handleSelectDate(date),
						})}
						onLevelChange={(level) => {
							if (open && level !== 'month') {
								setOpen(false);
								setDateTasks({ date: null, tasks: [] });
							}
						}}
					/>
				</Center>
				<Accordion value={open && dateTasks.date ? 'tasks' : 'none'} transitionDuration={200}>
					<Accordion.Item value='tasks'>
						<Accordion.Control disabled={!dateTasks.date} onClick={() => setOpen((state) => !state)}>
							<Group>
								<Text>Tasks for date:</Text>
								<Transition mounted={open} transition={opacity} duration={200} timingFunction='ease'>
									{(styles) => (
										<Text style={styles}>{dateTasks.date ? ` ${dateTasks.date.toLocaleDateString()}` : ''}</Text>
									)}
								</Transition>
							</Group>
						</Accordion.Control>
						<Accordion.Panel>
							{dateTasks.tasks.length === 0 ? (
								<Stack spacing='xs'>
									<Text align='center'>No tasks for this day</Text>
									<Text align='center'>How about we create some tasks?</Text>
									<Center>
										<CustomLink href='/tasks/create'>
											<Button color='orange' mx='auto'>
												Create task
											</Button>
										</CustomLink>
									</Center>
								</Stack>
							) : (
								<Stack spacing='xs' align='left'>
									{dateTasks.tasks.map((task) => {
										return <TaskInfo task={task} key={task.id} />;
									})}
								</Stack>
							)}
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Stack>
		</Container>
	);
}

export default TaskCalender;
