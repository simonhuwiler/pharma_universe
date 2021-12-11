import { writable } from 'svelte/store';

export const storeControlsEnabled = writable(false);
export const storeShowIntro = writable(true);
export const storeAnimationArray = writable([])
export const storeShowStahle = writable(false)
export const storeShowEasteregg = writable(false)
export const storeData = writable(null)
export const storeSearchItem = writable(null)