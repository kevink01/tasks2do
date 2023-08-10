import dayjs from 'dayjs';
import leapYear from 'dayjs/plugin/isLeapYear';
import moment from 'moment-timezone';
import { FirebaseTimestamp } from '@/types/firebase';
import { DAYS, HOURS, MINUTES, MONTHS, WEEKS } from './constants/time';

dayjs.extend(leapYear);

/* Return object for the daysRemaining function */
type DayJSRemaining = {
	overdue: boolean;
	message: string;
	unit: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
	value: number;
	severity: 'info' | 'warn' | 'danger' | 'error';
};

/**
 * Returns a new date object given the timestamp
 * @param timestamp The firebase timestamp (includes seconds & nanoseconds)
 * @returns New date object
 */
export function getDate(timestamp: FirebaseTimestamp): Date {
	return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}

/**
 * Returns the time relative to the user's timezone
 * @param date Date object
 * @returns Formatted date (including timezone)
 */
export function getTime(date: Date): string {
	return moment(date).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('h:mm A z');
}

/**
 * Converts the timestamp into a timezone-friendly string
 * @param timestamp The firebase timestamp (includes seconds & nanoseconds)
 * @returns Date & time (M/D/yyyy hh:mm a tz format)
 */
export function convertToTimestamp(timestamp: FirebaseTimestamp): string {
	const date = getDate(timestamp);
	return `${date.toLocaleDateString()} ${getTime(date)}`;
}

/**
 * Converts the timestamp into a timezone-friendly string
 * @param timestamp The firebase timestamp (includes seconds & nanoseconds)
 * @param [allDay=true] Flag for including time (defaults to true)
 * @returns Date & time (M/D/yyyy hh:mm a tz format)
 */
export function convertToDay(timestamp: FirebaseTimestamp, includeTime: boolean = true): string {
	const date = getDate(timestamp);
	return `${date.toLocaleDateString()}${!includeTime ? ' ' + getTime(date) : ''}`;
}

/**
 * Returns the beginning of the day
 * @param timestamp The firebase timestamp (includes seconds & nanoseconds)
 * @returns Date at 12:00 AM
 */
export function getBeginningOfDay(timestamp: FirebaseTimestamp): Date {
	const date = getDate(timestamp);
	return moment(date).startOf('day').toDate();
}

export function getBeginningOfDate(date: Date): Date {
	return moment(date).startOf('day').toDate();
}

/**
 * Returns the color associated with the severity
 * @param days Days Remaining object that contains the severity
 * @returns Red (error), orange (danger), yellow (warn), green (good), or white (unknown)
 */
export function getColor(days: DayJSRemaining | null): 'red' | 'orange' | 'yellow' | 'green' | 'white' {
	if (!days) return 'white';
	if (days.severity === 'error') return 'red';
	if (days.severity === 'danger') return 'orange';
	if (days.severity === 'warn') return 'yellow';
	return 'green';
}

/**
 * Returns a formatted string that notes how much time to a given date
 * @param timestamp The firebase timestamp (includes seconds & nanoseconds)
 * @returns Object containing: past the date, value & unit of measurement, message, and "severity" (how close/past is the date)
 */
export function daysRemaining(timestamp: FirebaseTimestamp) {
	const date = getDate(timestamp).valueOf();
	const currentDate = dayjs();

	const dayJSDate = dayjs(date);
	const diff = dayJSDate.diff(currentDate, 'd', true);
	const absDiff = Math.abs(diff);

	let returnValues: DayJSRemaining = {
		overdue: currentDate.isAfter(dayJSDate),
		message: '',
		unit: 'day',
		value: 1,
		severity: 'info',
	};

	switch (true) {
		case absDiff < MINUTES: {
			const units = dayJSDate.diff(undefined, 'minutes', true);
			returnValues.value = units;
			returnValues.unit = 'minute';
			returnValues.message = `${Math.abs(Math.floor(units))} ${Math.abs(units) < 2 ? 'minute' : 'minutes'} ${
				returnValues.overdue ? 'overdue' : 'remaining'
			}`;
			returnValues.severity = 'danger';
			break;
		}
		case absDiff < HOURS: {
			let units = dayJSDate.diff(undefined, 'hours', true);
			if (Math.abs(units) < 2) {
				units = dayJSDate.diff(undefined, 'minutes', true);
				returnValues.unit = 'minute';
				returnValues.severity = 'danger';
			} else {
				returnValues.unit = 'hour';
				if (units <= 48) {
					returnValues.severity = 'danger';
				} else {
					returnValues.severity = 'warn';
				}
			}
			returnValues.value = units;
			returnValues.message = `${Math.abs(Math.floor(units))} ${returnValues.unit}s ${
				returnValues.overdue ? 'overdue' : 'remaining'
			}`;
			break;
		}
		case absDiff < DAYS: {
			let units = dayJSDate.diff(undefined, 'days', true);
			if (Math.abs(units) < 2) {
				units = dayJSDate.diff(undefined, 'hours', true);
				returnValues.unit = 'hour';
				if (units <= 48) {
					returnValues.severity = 'danger';
				} else {
					returnValues.severity = 'warn';
				}
			} else {
				returnValues.unit = 'day';
				if (units <= 2) {
					returnValues.severity = 'danger';
				} else {
					returnValues.severity = 'warn';
				}
			}
			returnValues.value = units;
			returnValues.message = `${Math.abs(Math.floor(units))} ${returnValues.unit}s ${
				returnValues.overdue ? 'overdue' : 'remaining'
			}`;
			break;
		}
		case absDiff < WEEKS: {
			let units = dayJSDate.diff(undefined, 'weeks', true);
			if (Math.abs(units) < 2) {
				units = dayJSDate.diff(undefined, 'days', true);
				returnValues.unit = 'day';
				if (units <= 2) {
					returnValues.severity = 'danger';
				} else {
					returnValues.severity = 'warn';
				}
			} else {
				returnValues.unit = 'week';
				returnValues.severity = 'info';
			}
			returnValues.value = units;
			returnValues.message = `${Math.abs(Math.floor(units))} ${returnValues.unit}s ${
				returnValues.overdue ? 'overdue' : 'remaining'
			}`;
			break;
		}
		case absDiff < MONTHS: {
			let units = dayJSDate.diff(undefined, 'months', true);
			if (Math.abs(units) < 2) {
				units = dayJSDate.diff(undefined, 'weeks', true);
				returnValues.unit = 'week';
			} else {
				returnValues.unit = 'month';
			}
			returnValues.severity = 'info';
			returnValues.value = units;
			returnValues.message = `${Math.abs(Math.floor(units))} ${returnValues.unit}s ${
				returnValues.overdue ? 'overdue' : 'remaining'
			}`;
			break;
		}
		default: {
			let units = dayJSDate.diff(undefined, 'years', true);
			if (Math.abs(units) < 2) {
				units = dayJSDate.diff(undefined, 'months', true);
				returnValues.unit = 'month';
			} else {
				returnValues.unit = 'year';
			}
			returnValues.severity = 'info';
			returnValues.value = units;
			returnValues.message = `${Math.abs(Math.floor(units))} ${returnValues.unit}s ${
				returnValues.overdue ? 'overdue' : 'remaining'
			}`;
		}
	}
	if (returnValues.overdue) {
		returnValues.severity = 'error';
	}
	return returnValues;
}
