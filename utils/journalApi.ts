import { apiRequest } from './api';
import { JournalEntry } from '../types/journal';

export async function fetchJournals(email: string): Promise<JournalEntry[]> {
  return await apiRequest({
    method: 'GET',
    url: process.env.NEXT_PUBLIC_BACKEND_URL + '/journals',
    params: { email },
  });
}

export async function createJournal(entry: { title: string; content: string; email: string }): Promise<void> {
  await apiRequest({
    method: 'POST',
    url: process.env.NEXT_PUBLIC_BACKEND_URL + '/journals',
    data: entry,
  });
}

export async function deleteJournal(id: string, email: string): Promise<void> {
  await apiRequest({
    method: 'DELETE',
    url: process.env.NEXT_PUBLIC_BACKEND_URL + `/journals/${id}`,
    params: { email },
  });
}

export async function updateJournal(id: string, entry: { title: string; content: string; email: string }): Promise<void> {
  await apiRequest({
    method: 'PUT',
    url: process.env.NEXT_PUBLIC_BACKEND_URL + `/journals/${id}`,
    data: entry,
  });
}
