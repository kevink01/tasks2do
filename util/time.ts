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
 * @returns Date At 12:00 AM
 */
export function getBeginningOfDay(timestamp: FirebaseTimestamp): Date {
	const date = getDate(timestamp);
	return moment(date).startOf('day').toDate();
}

/**
 * Returns the end of the day
 * @param timestamp The firebase timestamp (includes seconds & nanoseconds)
 * @returns At 11:59:59 PM
 */
export function getEndOfDay(timestamp: FirebaseTimestamp): Date {
	const date = getDate(timestamp);
	return moment(date).endOf('day').toDate();
}

/**
 * Returns the beginning of the day
 * @param date Date
 * @returns At 12:00:00 AM
 */
export function getBeginningOfDate(date: Date): Date {
	return moment(date).startOf('day').toDate();
}

/**
 * Returns the end of the day
 * @param date Date
 * @returns At 11:59:59 PM
 */
export function getEndOfDate(date: Date): Date {
	return moment(date).endOf('day').toDate();
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

export function daysDifference(timestamp1: FirebaseTimestamp, timestamp2: FirebaseTimestamp) {
	const date1 = dayjs(getDate(timestamp1));
	const date2 = dayjs(getDate(timestamp2));

	return difference(date1, date2);
}

/**
 * Returns a formatted string that notes how much time to a given date
 * @param timestamp The firebase timestamp (includes seconds & nanoseconds)
 * @returns Object containing: past the date, value & unit of measurement, message, and "severity" (how close/past is the date)
 */
export function daysRemaining(timestamp: FirebaseTimestamp): DayJSRemaining {
	const date = getDate(timestamp);
	const currentDate = dayjs();
	const dayJSDate = dayjs(date);

	return difference(dayJSDate, currentDate);
}

function difference(date1: dayjs.Dayjs, date2: dayjs.Dayjs): DayJSRemaining {
	const diff = date1.diff(date2, 'd', true);
	const absDiff = Math.abs(diff);

	let returnValues: DayJSRemaining = {
		overdue: date2.isAfter(date1),
		message: '',
		unit: 'day',
		value: 1,
		severity: 'info',
	};

	switch (true) {
		case absDiff < MINUTES: {
			const units = date1.diff(date2, 'minutes', true);
			returnValues.value = units;
			returnValues.unit = 'minute';
			returnValues.message = `${Math.abs(Math.floor(units))} ${Math.abs(units) < 2 ? 'minute' : 'minutes'} ${
				returnValues.overdue ? 'overdue' : 'remaining'
			}`;
			returnValues.severity = 'danger';
			break;
		}
		case absDiff < HOURS: {
			let units = date1.diff(date2, 'hours', true);
			if (Math.abs(units) < 2) {
				units = date1.diff(date2, 'minutes', true);
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
			let units = date1.diff(date2, 'days', true);
			if (Math.abs(units) < 2) {
				units = date1.diff(date2, 'hours', true);
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
			let units = date1.diff(date2, 'weeks', true);
			if (Math.abs(units) < 2) {
				units = date1.diff(date2, 'days', true);
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
			let units = date1.diff(date2, 'months', true);
			if (Math.abs(units) < 2) {
				units = date1.diff(date2, 'weeks', true);
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
			let units = date1.diff(date2, 'years', true);
			if (Math.abs(units) < 2) {
				units = date1.diff(date2, 'months', true);
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
