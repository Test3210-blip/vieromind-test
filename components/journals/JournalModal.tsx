import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import {
  journalErrorAtom // Atom for error state
} from '../../state/journalUIAtoms';

// Props for the journal modal dialog
interface JournalModalProps {
  open: boolean; // Whether the modal is open
  onClose: () => void; // Function to close the modal
  onSave: (data: { title: string; content: string }) => Promise<void>; // Save handler
  saving: boolean; // Loading state for save
  initialValues?: { title: string; content: string } | null; // Initial values for editing
  isEdit?: boolean; // Whether it's an edit operation
}

// Modal dialog for adding a new journal entry
export default function JournalModal({ open, onClose, onSave, saving, initialValues, isEdit }: JournalModalProps) {
  const [error] = useAtom(journalErrorAtom);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialValues || { title: '', content: '' },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset(initialValues || { title: '', content: '' });
    }
  }, [open, reset, initialValues]);

  // Handle form submission
  const handleFormSubmit = async (data: { title: string; content: string }) => {
    await onSave(data);
    reset({ title: '', content: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Modal overlay and panel */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <Dialog.Panel className="relative bg-white dark:bg-black rounded-xl shadow-2xl max-w-md w-full p-8 z-10">
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <Dialog.Title className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
            {isEdit ? 'Edit Journal' : 'Add New Journal'}
          </Dialog.Title>
          {/* Journal entry form */}
          <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <div>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                placeholder="Title"
                className="w-full px-4 py-2 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                disabled={saving}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message as string}</p>
              )}
            </div>
            <div>
              <textarea
                {...register('content', { required: 'Content is required' })}
                placeholder="Write your thoughts..."
                className="w-full px-4 py-2 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg h-40 focus:ring-2 focus:ring-blue-400 outline-none"
                disabled={saving}
                aria-invalid={!!errors.content}
              />
              {errors.content && (
                <p className="text-red-600 text-sm mt-1">{errors.content.message as string}</p>
              )}
            </div>
            {/* Show error from state if present */}
            {error && (
              <p className="text-red-600 text-center text-sm mt-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 cursor-pointer"
              disabled={saving}
            >
              {saving ? (isEdit ? 'Saving...' : 'Saving...') : (isEdit ? 'Save Changes' : 'Save Entry')}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
