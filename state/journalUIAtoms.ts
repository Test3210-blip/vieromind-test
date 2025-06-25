import { atom } from 'jotai';

export const journalLoadingAtom = atom(false);
export const journalSavingAtom = atom(false);
export const journalErrorAtom = atom<string | null>(null);
export const journalModalOpenAtom = atom(false);
export const journalFormTouchedAtom = atom(false);
export const aiChatHistoryAtom = atom<{ role: 'user' | 'ai'; content: string }[]>([]);
