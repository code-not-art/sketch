export type Identity<T> = T extends object
	? {
			[P in keyof T]: T[P];
	  }
	: T;
