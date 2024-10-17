import { writable } from 'svelte/store';

export const storeCamera = writable(null)
export const storeControlsEnabled = writable(false);
export const storeControlButtonsEnabled = writable(false);
export const storeShowIntro = writable(true);
export const storeAnimationArray = writable([])
export const storeActivateRaysInIntro = writable(null)
export const storeShowEasteregg = writable(false)
export const storeData = writable(null)
export const storeSearchItem = writable(null)
export const storeChapter = writable(-1)
export const storeShowInstructions = writable(false)
export const storeShowInstructionsAlreadyShown = writable(false)