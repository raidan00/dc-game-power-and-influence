import { writable } from 'svelte/store';

export const lvl = writable(0);
export const scoreData = writable({
	yourVoters: 0,
	opponentVoters: 0,
	nextUpgrade: 0,
});
