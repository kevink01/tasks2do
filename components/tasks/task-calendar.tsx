import { useState } from 'react';
import { Accordion, Button, Center, Container, Group, Indicator, Stack, Text, Transition } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { TaskFetch } from '@/types/tasks';
import { getBeginningOfDay } from '@/util/time';
import { scaleTransition } from '@/util/transition';
import TaskInfo from './task-info';
import CustomLink from '../custom-link';

type SelectedDate = {
	date: Date | null;
	tasks: TaskFetch[];
};

type TaskCalendarProps = {
	days: number[];
	tasks: TaskFetch[];
};

function TaskCalender({ days, tasks }: TaskCalendarProps) {
	const [selectedDate, setSelectedDate] = useState<SelectedDate>({ date: null, tasks: [] });
	const [open, setOpen] = useState<boolean>(false);

	const opacity = scaleTransition('X');

	const handleSelectDate = (date: Date) => {
		if (selectedDate.date && selectedDate.date.valueOf() === date.valueOf()) {
			setOpen((mode) => !mode);
		} else {
			if (tasks) {
				const dateTasks = tasks
					.filter((task) => getBeginningOfDay(task.complete).valueOf() === date.valueOf())
					.sort((task1, task2) => {
						const task1Time = task1.complete.seconds + task1.complete.nanoseconds / 1000000;
						const task2Time = task2.complete.seconds + task2.complete.nanoseconds / 1000000;
						return task1Time - task2Time || task1.name > task2.name ? 1 : task1.name < task2.name ? -1 : 0;
					});
				if (selectedDate.date !== null) {
					setSelectedDate({ ...selectedDate, date: null });
					setOpen(false);
					setTimeout(() => {
						setSelectedDate({ date: date, tasks: dateTasks });
						setOpen(true);
					}, 200);
				} else {
					setSelectedDate({ date: date, tasks: dateTasks });
					setOpen(true);
				}
			} else {
				setSelectedDate({ date: date, tasks: [] });
				setOpen(true);
			}
		}
	};

	return (
		<Container size='sm' px='xs'>
			<Stack>
				<Center>
					<Calendar
						size='md'
						firstDayOfWeek={0}
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
						onLevelChange={(level) => {
							if (open && level !== 'month') {
								setOpen(false);
								setSelectedDate({ date: null, tasks: [] });
							}
						}}
					/>
				</Center>
				<Accordion value={open && selectedDate.date ? 'tasks' : 'none'} transitionDuration={200}>
					<Accordion.Item value='tasks'>
						<Accordion.Control disabled={!selectedDate.date} onClick={() => setOpen((state) => !state)}>
							<Group>
								<Text>Tasks for date:</Text>
								<Transition
									mounted={selectedDate.date !== null}
									transition={opacity}
									duration={200}
									timingFunction='ease'>
									{(styles) => (
										<Text style={styles}>{selectedDate.date ? ` ${selectedDate.date.toLocaleDateString()}` : ''}</Text>
									)}
								</Transition>
							</Group>
						</Accordion.Control>
						<Accordion.Panel>
							{selectedDate.tasks.length === 0 ? (
								<Stack spacing='xs'>
									<Text align='center'>No tasks for this day</Text>
									<Text align='center'>How about we create some tasks?</Text>
									<Center>
										<CustomLink href='/tasks/create'>
											<Button color='orange' mx='auto'>
												Create tasks
											</Button>
										</CustomLink>
									</Center>
								</Stack>
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
	);
}

export default TaskCalender;
