export type FirebaseResult<T> =
	| {
			success: true;
			data: T;
	  }
	| { success: false; error: string };
