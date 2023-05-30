import Login from '@/components/login';

export default function Home() {
	return (
		<main className='flex flex-col m-auto space-y-2'>
			<div className='max-w-xs text-center'>
				<p>Welcome to tasks2Do!</p>
				<p>We&apos;re here to track all your tasks, chores, reminders - you name it! </p>
			</div>
			<Login text='Signin with Google' isHeader={false} />
		</main>
	);
}
