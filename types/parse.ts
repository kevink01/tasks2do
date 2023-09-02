import { z } from 'zod';

type Parse<T> =
	| {
			success: true;
			data: T;
	  }
	| { success: false; errors: { code: string; path: (string | number)[]; message: string }[] };

export const parse = <T>(schema: z.Schema<T>, data: unknown): Parse<T> => {
	try {
		const result = schema.parse(data);
		return { success: true, data: result };
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			const error = err as z.ZodError;
			return {
				success: false,
				errors: error.issues.map((err) => {
					return {
						code: err.code,
						path: err.path,
						message: err.message,
					};
				}),
			};
		} else {
			return {
				success: false,
				errors: [
					{
						code: 'custom',
						path: ['unknown'],
						message: 'Unknown error',
					},
				],
			};
		}
	}
};
