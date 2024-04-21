import { writable } from 'svelte/store';

export const lvl = writable(1);
export const scoreData = writable({
	yourVoters: 0,
	opponentVoters: 0,
});
export const power = writable(0);
export const influence = writable(0);

export const winLooseMsg = writable("You Win");

