import { Member, PartialEmoji, PossiblyUncachedMessage, Uncached } from 'eris';

export type Awaitable<T> = T|PromiseLike<T>;
export type RestOrArray<T> = T[]|[T[]];

export interface Reaction extends PartialEmoji {
	reactor: Member|Uncached;
	message: PossiblyUncachedMessage;
}

export function normalizeArray<T>(arr: RestOrArray<T>): T[] {
	return Array.isArray(arr[0]) ? arr[0] : arr as T[];
}