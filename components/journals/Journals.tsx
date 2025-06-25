import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { journalEntriesAtom } from 'state/journalAtoms';
import {
  journalLoadingAtom,
  journalSavingAtom,
  journalErrorAtom,
  journalModalOpenAtom,
  aiChatHistoryAtom
} from '../../state/journalUIAtoms';
import JournalList from './JournalList';
import JournalModal from './JournalModal';
import JournalEmptyState from './JournalEmptyState';
import JournalLoader from './JournalLoader';
import AiReflectSection from 'components/AiReflectDrawer';
import { toast } from 'react-hot-toast';
import { fetchJournals, createJournal, deleteJournal, updateJournal } from '../../utils/journalApi';
import Image from 'next/image';
import { JournalEntry } from 'types/journal';

/**
 * JournalsPage - Main journaling dashboard with entry list, details, and AI reflection.
 */
export default function JournalsPage() {
  // --- Auth & State ---
  const { data: session } = useSession();
  const [entries, setEntries] = useAtom(journalEntriesAtom);
  const [loading, setLoading] = useAtom(journalLoadingAtom);
  const [saving, setSaving] = useAtom(journalSavingAtom);
  const [, setError] = useAtom(journalErrorAtom);
  const [modalOpen, setModalOpen] = useAtom(journalModalOpenAtom);
  const [chatHistory, setChatHistory] = useAtom(aiChatHistoryAtom);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAiReflectVisible, setIsAiReflectVisible] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // --- Derived Data ---
  const selectedEntry = entries.find(e => e._id === selectedId) || null;

  // --- Data Fetching ---
  useEffect(() => {
    if (session?.user?.email) fetchEntries();
    // eslint-disable-next-line
  }, [session?.user?.email]);

  async function fetchEntries() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJournals(session?.user?.email ?? '');
      setEntries(res);
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to load journal entries.');
      toast.error('Failed to load journal entries. Please check your connection or try again.');
    } finally {
      setLoading(false);
    }
  }

  async function createEntry(data: { title: string; content: string }) {
    setSaving(true);
    setError(null);
    try {
      await createJournal({ ...data, email: session?.user?.email ?? '' });
      fetchEntries();
      toast.success('Journal entry saved!');
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to save journal entry.');
      toast.error('Failed to save journal entry. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!session?.user?.email) return;
    setLoading(true);
    setError(null);
    try {
      await deleteJournal(id, session.user.email);
      fetchEntries();
      toast.success('Journal entry deleted!');
      if (selectedId === id) setSelectedId(null);
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to delete journal entry.');
      toast.error('Failed to delete journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEditEntry(data: { title: string; content: string }) {
    if (!editingEntry || !editingEntry._id) return;
    setSaving(true);
    setError(null);
    try {
      await updateJournal(editingEntry._id, { ...data, email: session?.user?.email ?? '' });
      await fetchJournals(session?.user?.email ?? '').then(setEntries); // fetch without toast
      toast.success('Journal entry updated!');
      setEditModalOpen(false);
      setEditingEntry(null);
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to update journal entry.');
      toast.error('Failed to update journal entry. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // --- AI Reflection Logic ---
  const systemPrompt = {
    role: 'system',
    content: `You are a professional journaling assistant. When given a journal entry, analyze it using the following structure:\n\n- Journal Reflection: Provide a concise, empathetic summary of the main points and overall sentiment (2-3 sentences).\n- Mood Snapshot: Use 1-3 relevant emojis and a brief explanation to capture the mood.\n- Key Observations: List 1-3 prominent themes, emotions, or patterns you notice. Use bullet points or short paragraphs.\n- For Further Reflection: Pose 1-2 open-ended, non-judgmental questions to encourage deeper thought, without leading to a specific answer.\n- Recommended for You: Suggest 2-3 personalized mental health or self-improvement resources (with a short title, category, and level such as Beginner/Intermediate/Advanced) based on the journal entry. Format as a list.\n- Your Progress: Estimate the user's current mood on a scale of 1-10 and display as 'Current Mood: X/10'.\n\nIf the user asks about their mood or wants to chat, respond conversationally, empathetically, and concisely. Never ask the user to provide their journal entry; always assume you have it if it is present.`
  };

  /**
   * Requests AI reflection. If isInitialInsight, sends only the entry. Otherwise, continues chat.
   */
  async function handleAiReflect(userMessage?: string, isInitialInsight = false) {
    setAiLoading(true);
    let newHistory = chatHistory;
    if (userMessage && !isInitialInsight) {
      newHistory = [...chatHistory, { role: 'user', content: userMessage }];
      setChatHistory(newHistory);
    }
    try {
      let openAiMessages = [];
      if (isInitialInsight) {
        openAiMessages = [systemPrompt, { role: 'user', content: selectedEntry?.content || '' }];
      } else if (newHistory.length === 0) {
        openAiMessages = [systemPrompt];
      } else {
        openAiMessages = [
          systemPrompt,
          ...newHistory.map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content
          }))
        ];
      }
      const res = await fetch('/api/ai-reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: openAiMessages }),
      });
      const data = await res.json();
      setChatHistory(prev => ([...prev, { role: 'ai', content: data.reflection || 'No response from AI.' }]));
    } catch {
      setChatHistory(prev => ([...prev, { role: 'ai', content: 'Failed to get AI reflection.' }]));
    } finally {
      setAiLoading(false);
    }
  }

  /**
   * Opens the AI Reflect section and starts the chat with an intro and the selected entry.
   */
  async function openAiReflect() {
    if (!selectedEntry) return; // Just return, don't show toast
    setIsAiReflectVisible(true);
    setChatHistory([
      { role: 'ai', content: "Hi, I’m your personal journaling companion. I’m here to help you make sense of your thoughts, track your growth, and support your emotional clarity — one entry at a time." },
      { role: 'user', content: 'Get insight on my entry' }
    ]);
    await handleAiReflect(selectedEntry.content, true);
  }

  // Reset chat and hide AI Reflect when a new entry is selected
  function handleSelectEntry(id: string | null) {
    setSelectedId(id);
    setIsAiReflectVisible(false);
    setChatHistory([]);
  }

  // --- Render ---
  return (
    <div className="flex overflow-hidden bg-[#f8faff] dark:bg-[#18181b] h-full">
      {/* Sidebar: User info, new entry, journal list */}
      <aside className="w-[340px] min-w-[280px] max-w-[360px] bg-white dark:bg-[#23232a] border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
        <SidebarUser session={session} />
        <button
          onClick={() => setModalOpen(true)}
          className="mx-6 my-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base flex items-center justify-center gap-2 shadow cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" /> New Entry
        </button>
        <div className="flex-1 overflow-y-auto px-2 pb-4 py-2">
          {loading ? <JournalLoader /> : entries.length === 0 ? <JournalEmptyState /> : (
            <JournalList
              entries={entries}
              selectedId={selectedId}
              setSelectedId={handleSelectEntry}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </aside>
      {/* Main Content: Entry details, AI reflect, modal */}
      <main className="flex-1 flex flex-col h-full">
        <div className="flex items-center gap-3 px-8 py-4 border-b border-gray-100 dark:border-gray-700 justify-end">
          <button
            className="ml-2 px-3 py-1 rounded bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200 text-xs font-semibold border border-violet-200 dark:border-violet-700 cursor-pointer"
            onClick={() => {
              
              if (!selectedEntry) {
                console.log("check")
                toast.error('Please select a journal entry first.');
                return;
              }
              openAiReflect();
            }}
            // disabled={!selectedEntry}
          >
            <span role="img" aria-label="star">⭐</span> AI Reflect
          </button>
        </div>
        <div className="flex flex-row h-full">
          <EntryDetails entry={selectedEntry} onEdit={() => {
            if (selectedEntry) {
              setEditingEntry(selectedEntry);
              setEditModalOpen(true);
            }
          }} />
          {isAiReflectVisible && (
            <div className="w-[420px] max-w-[100vw] h-full flex flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b] relative">
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                aria-label="Close AI Reflect"
                onClick={() => setIsAiReflectVisible(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <AiReflectSection
                loading={aiLoading}
                chatHistory={chatHistory}
                onSendMessage={msg => handleAiReflect(msg)}
              />
            </div>
          )}
        </div>
        <JournalModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); }}
          onSave={async (data: { title: string; content: string }) => { await createEntry(data); setModalOpen(false); }}
          saving={saving}
        />
        <JournalModal
          open={editModalOpen}
          onClose={() => { setEditModalOpen(false); setEditingEntry(null); }}
          onSave={handleEditEntry}
          saving={saving}
          initialValues={editingEntry ? { title: editingEntry.title, content: editingEntry.content } : undefined}
          isEdit
        />
        {aiLoading && (
          <div className="flex items-center justify-center w-full h-full absolute top-0 left-0 bg-white/70 dark:bg-[#18181b]/70 z-50">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        )}
      </main>
      
    </div>
  );
}

/**
 * SidebarUser - Renders user avatar and info in the sidebar.
 */
function SidebarUser({ session }: { session: { user?: { image?: string | null; name?: string | null; email?: string | null } | null } | null }) {
  return (
    <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100 dark:border-gray-700">
      {session?.user?.image ? (
        <Image src={session.user.image} alt="avatar" className="w-10 h-10 rounded-full" width={40} height={40} />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-200 text-lg">
          {session?.user?.name?.[0]?.toUpperCase() || '?'}
        </div>
      )}
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">{session?.user?.name || 'User'}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.email}</div>
      </div>
    </div>
  );
}

/**
 * EntryDetails - Renders the selected journal entry or an empty state.
 */
function EntryDetails({ entry, onEdit }: { entry: JournalEntry | null, onEdit: () => void }) {
  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 flex-1 px-8 py-8">
        <span className="italic">Select or add a journal entry to get started.</span>
      </div>
    );
  }
  return (
    <div className="flex-1 px-8 py-8 overflow-y-auto">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">{entry.title || 'Untitled Entry'}</h2>
          <button
            onClick={onEdit}
            className="ml-auto px-3 py-1 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-semibold border border-green-200 dark:border-green-700 flex items-center gap-1 shadow-sm hover:bg-green-200 dark:hover:bg-green-800 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 4l4 4-8 8-4-4 8-8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4 4 8-8-4-4-8 8z" />
            </svg>
            Edit
          </button>
        </div>
        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span>📅 {new Date(entry.createdAt ?? '').toLocaleDateString()}</span>
          <span>🕒 {new Date(entry.createdAt ?? '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>✍️ {entry.content?.split(/\s+/).filter(Boolean).length || 0} words</span>
        </div>
        <div className="prose max-w-none text-gray-800 dark:text-gray-200 text-base whitespace-pre-line break-words break-all">
          {entry.content}
        </div>
      </div>
    </div>
  );
}

// 7. State management: Suggestion for custom hook (not implemented for now, as state is already colocated and manageable)
