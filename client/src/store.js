import { writable } from 'svelte/store';

export const storeControlsEnabled = writable(false);
export const storeShowIntro = writable(true);
export const storeAnimationArray = writable([])
export const storeShowStahle = writable(false)