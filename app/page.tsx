// Main landing page for Vieromind app. Handles authentication, theme, and journal UI.
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import JournalPage from 'components/journals/Journals';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { useTheme } from './theme-provider';
import Image from 'next/image';

export default function HomePage() {
  // Get user session and theme context
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  if (status === 'loading') {
    // Show loading spinner or placeholder while session is loading
    return <div />;
  }

  // Main layout: header and main content
  return (
    <>
      {/* App header with title, theme toggle, and sign out button */}
      <div className="flex h-screen flex-col">
        <header className="flex flex-shrink-0 items-center justify-between w-full px-8 py-4 bg-white dark:bg-[#000]">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vieromind</h1>
          <div className="flex items-center gap-3">
            {/* Toggle dark/light mode */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
            {/* Sign out button if user is logged in */}
            {session && (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 shadow hover:bg-gray-300 transition-colors font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                aria-label="Sign out"
              >
                Sign out
              </button>
            )}
          </div>
        </header>
        <main className="bg-white flex-1 dark:bg-black">
          {/* If not signed in, show welcome and sign in button. Otherwise, show journal UI. */}
          {!session ? (
            <div className="flex items-center justify-center w-full h-screen">
              <div className="bg-[#f5f7fa] dark:bg-transparent dark:shadow-[0px_0px_12px_0px_#fff]  rounded-2xl shadow-2xl p-16 flex flex-col items-center max-w-xl w-full">
                <Image src="/globe.svg" alt="Logo" className="w-20 h-20 mb-8" width={80} height={80} />
                <h1 className="text-4xl font-extrabold mb-3 text-[#2c3e50] dark:text-[#ecf0f1]">Welcome to Vieromind</h1>
                <p className="text-[#3498db] dark:text-[#2980b9] mb-10 text-lg text-center">Sign in to continue with your Google account</p>
                <button
                  onClick={() => signIn('google')}
                  className="flex items-center gap-3 px-8 py-4 bg-[#e74c3c] hover:bg-[#3498db] text-white rounded-lg font-semibold shadow-lg text-lg transition-all duration-200 dark:bg-[#c0392b] dark:hover:bg-[#2980b9] cursor-pointer"
                >
                  {/* Google icon SVG */}
                  <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.13 2.36 30.45 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.99 6.21C12.13 13.09 17.57 9.5 24 9.5z" /><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.99 37.13 46.1 31.3 46.1 24.55z" /><path fill="#FBBC05" d="M10.68 28.3a14.5 14.5 0 0 1 0-8.6l-7.99-6.21A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.51l7.99-6.21z" /><path fill="#EA4335" d="M24 48c6.45 0 12.13-2.13 16.19-5.8l-7.19-5.59c-2.01 1.35-4.59 2.16-9 2.16-6.43 0-11.87-3.59-14.32-8.8l-7.99 6.21C6.73 42.2 14.82 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></g></svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          ) : (
            // Error boundary for the main journal UI
            <ErrorBoundary>
              <JournalPage />
            </ErrorBoundary>
          )}
        </main>
      </div>
    </>
  );
}
