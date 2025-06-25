import { atom } from 'jotai';
import { JournalEntry } from '../types/journal';

export const journalEntriesAtom = atom<JournalEntry[]>([]);
