import { writable } from 'svelte/store';

export const storeControlsEnabled = writable(false);
export const storeShowIntro = writable(true);