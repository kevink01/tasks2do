import { fadeTransition } from '@/util/transition';
import {
	Alert,
	Avatar,
	Button,
	ColorInput,
	Container,
	Group,
	Menu,
	rem,
	Text,
	TextInput,
	Transition,
} from '@mantine/core';
import { Label, Settings } from '@/types/settings';
import React, { useState } from 'react';
import { modals } from '@mantine/modals';
import { FaExclamation, FaStickyNote } from 'react-icons/fa';
import { notify, updateNotification } from '@/util/notifications/notify';
import useLabels from '@/hooks/use-labels';

type AddLabelProps = {
	addMode: boolean;
	setAddMode: (value: boolean) => void;

	labels: Label[];
	settings: Settings;
};

export default function AddLabel({ addMode, setAddMode, labels, settings }: AddLabelProps) {
	const [label, setLabel] = useState<Label>({ name: '', color: '' });

	const { updateLabels } = useLabels();

	const test = () => {
		console.log(label);
	};

	const promptConfirmation = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Adding label',
			children: (
				<Container>
					<Alert
						icon={<FaExclamation />}
						title='Do you want to confirm these changes'
						color='yellow'
						radius='xs'
						mb={rem(4)}>
						This will create a new label
					</Alert>
					<Text>Label name: {label.name}</Text>
					<Text>Label color: {label.color}</Text>
					<Avatar variant='filled' size='sm' style={{ background: label.color }}>
						<></>
					</Avatar>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green' },
			onConfirm: () => {
				const id = notify(
					`add-label-${label.name}`,
					`Adding new label: ${label.name}`,
					'Your data will be loaded',
					true,
					settings,
					'info'
				);
				const result = updateLabels(labels, { name: label.name, color: label.color });
				if (result.success) {
					updateNotification(id, 'Success!', 'Successfully added label', settings, 'success', <FaStickyNote />);
					setLabel({ name: '', color: '' });
					setAddMode(false);
				} else {
					updateNotification(id, 'Error!', 'Unable to create label', settings, 'error');
				}
			},
		});
	};

	return (
		<Transition mounted={addMode} transition={fadeTransition()} duration={200} timingFunction='ease'>
			{(styles) => (
				<div style={styles}>
					<Group align='end' className='flex'>
						<div className='flex-1'>
							<TextInput
								label='Label name'
								placeholder='Name'
								value={label.name}
								onChange={(event) => setLabel((values) => ({ ...values, name: event.target.value }))}
							/>
						</div>
						<ColorInput onChangeEnd={(color: string) => setLabel((values) => ({ ...values, color: color }))} />
						<Button color='orange' onClick={promptConfirmation}>
							Add label
						</Button>
						<Button color='orange' onClick={() => setAddMode(false)}>
							Cancel
						</Button>
					</Group>
				</div>
			)}
		</Transition>
	);
}
