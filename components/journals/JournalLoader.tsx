import React from 'react';

const JournalLoader: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse border-2 border-blue-100 rounded-xl p-6 bg-gradient-to-br from-white to-blue-50 shadow-md">
          <div className="h-6 bg-blue-100 rounded w-1/3 mb-2" />
          <div className="h-4 bg-blue-100 rounded w-1/4 mb-4" />
          <div className="h-4 bg-blue-100 rounded w-full mb-1" />
          <div className="h-4 bg-blue-100 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
};

export default JournalLoader;
