/**
 * Development mode
 * @returns If process is in dev mode
 */
export function isDev(): boolean {
	return process.env.NODE_ENV === 'development';
}

/**
 * Production mode
 * @returns If process is in prod mode
 */
export function isProd(): boolean {
	return process.env.NODE_ENV === 'production';
}

/**
 * Test mode
 * @returns If process is in test mode
 */
export function isTest(): boolean {
	return process.env.NODE_ENV === 'test';
}
