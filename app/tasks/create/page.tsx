'use client';

import { useState } from 'react';
import { Button, Container, TextInput, Textarea } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from 'react-hook-form';
// import { test } from '@/util/types/index';

type Test = {
	name: string;
	description: string;
	complete: Date;
};

function TaskCreate() {
	const [date, setDate] = useState<Date | null>();
	const {
		getValues,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Test>();

	const submission = () => {
		register('complete', { value: new Date(date as Date) });
		console.log(getValues());
	};

	return (
		<Container size='md' px='xs'>
			<form onSubmit={handleSubmit(submission)}>
				<TextInput
					placeholder='Task name'
					label='Name'
					radius='md'
					size='md'
					withAsterisk
					error={errors.name?.message}
					{...register('name', {
						minLength: {
							value: 5,
							message: 'Testing',
						},
					})}
				/>
				<Textarea
					placeholder='Your description'
					label='Description'
					radius='md'
					size='md'
					autosize
					minRows={2}
					maxRows={4}
					{...register('description')}
				/>
				<DateTimePicker
					label='Completion date'
					placeholder='Pick date and time'
					minDate={new Date()}
					firstDayOfWeek={0}
					onChange={(e) => {
						console.log(e);
						setDate(e);
					}}
				/>
				<Button type='submit'>Click me</Button>
				{/* <Button onClick={() => test({ name: 'abcdefg', description: '123456', complete: new Date(432849083849032) })}>
					{' '}
					Click me again!
				</Button> */}
			</form>
		</Container>
	);
}

export default TaskCreate;
