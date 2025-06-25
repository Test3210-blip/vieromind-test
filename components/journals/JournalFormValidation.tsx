import React from 'react';

// Props for the form validation feedback component
interface JournalFormValidationProps {
  title: string; // Title input value
  content: string; // Content input value
  error: string | null; // Error message from state
}

// Shows validation or error messages for the journal form
const JournalFormValidation = ({ title, content, error }: JournalFormValidationProps) => {
  if (error) {
    // Show error from state (e.g., API error)
    return <p className="text-red-600 font-semibold text-center">{error}</p>;
  }
  if (!title.trim() || !content.trim()) {
    // Show validation warning if fields are empty
    return <p className="text-yellow-600 font-semibold text-center">Title and content are required.</p>;
  }
  return null;
};

export default JournalFormValidation;
