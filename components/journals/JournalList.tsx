import { JournalEntry } from 'types/journal';
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

// Props for the journal list component
interface JournalListProps {
  entries: JournalEntry[]; // Array of journal entries
  selectedId: string | null; // Currently selected entry ID
  setSelectedId: (id: string | null) => void; // Function to select an entry
  handleDelete: (id: string) => void; // Function to delete an entry
}

// Renders a list of journal entries with selection and delete options
const JournalList = ({ entries, selectedId, setSelectedId, handleDelete }: JournalListProps) => {
  if (!entries.length) return null;
  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry._id} className="relative group">
          {/* Entry button: select to view details */}
          <button
            className={`w-full text-left rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#23232a] hover:bg-blue-50 dark:hover:bg-[#23233a] transition flex flex-col shadow-sm ${selectedId === entry._id ? 'ring-2 ring-blue-400 dark:ring-blue-600' : ''} cursor-pointer`}
            onClick={() => entry._id && setSelectedId(entry._id || null)}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900 dark:text-gray-100 text-base truncate max-w-[140px]">{entry.title || 'Untitled Entry'}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{new Date(entry.createdAt ?? '').toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{entry.content?.slice(0, 40) || ''}</div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 dark:text-gray-500">{entry.content?.split(/\s+/).filter(Boolean).length || 0} words</span>
            </div>
          </button>
          {/* Delete button: appears on hover */}
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#23232a] rounded-full z-10 cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              if (entry._id) handleDelete(entry._id);
            }}
            aria-label="Delete journal entry"
            type="button"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default JournalList;

// 10. Performance: Add a note for virtualization if journal list grows large
// (Current implementation is fine for small/medium lists. For large lists, consider react-window or react-virtualized.)
