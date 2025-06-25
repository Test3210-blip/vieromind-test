import React from 'react';

const JournalEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-200 mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0H3m9 0a9 9 0 100-18 9 9 0 000 18z" />
      </svg>
      <p className="text-gray-500 italic text-lg">No journal entries yet. Start writing!</p>
    </div>
  );
};

export default JournalEmptyState;
