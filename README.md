# Vieromind Prototype

Vieromind is a modern journaling web application that leverages AI to help users reflect on their thoughts and experiences. Built with Next.js, Tailwind CSS, Jotai, and OpenAI, it provides a seamless, secure, and interactive journaling experience.

## Features

- **User Authentication:** Secure sign-in with Google using NextAuth.js.
- **Journaling:** Create, view, and delete personal journal entries.
- **AI Reflection:** Get AI-powered reflections and insights on your journal entries using OpenAI GPT-4o.
- **Modern UI:** Responsive and accessible design with Tailwind CSS and Headless UI.
- **State Management:** Fast and scalable state management with Jotai.
- **Error Handling:** Robust error boundaries for a smooth user experience.
- **Dark/Light Mode:** Easily toggle between dark and light themes.

## Dataflow Diagram

![Vieromind Dataflow Diagram](public/dataflow-diagram.png)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your Google OAuth and OpenAI API credentials:
     ```env
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     OPENAI_API_KEY=your-openai-api-key
     NEXT_PUBLIC_BACKEND_URL=your-backend-url
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Sign in with your Google account.
- Create new journal entries, edit or delete them as needed.
- Select an entry and use the AI Reflect feature to get insights and reflections powered by GPT-4o.
- Toggle between dark and light mode for your preferred experience.

## Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jotai](https://jotai.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)

## Folder Structure
- `app/` - Main app pages, API routes, and providers
- `components/` - UI components (journals, AI drawer, error boundaries)
- `state/` - Jotai atoms for state management
- `utils/` - API utilities
- `types/` - TypeScript types
- `public/` - Static assets

## Testing
- Run tests with:
  ```bash
  npm run test
  # or
  yarn test
  ```

## License
This project is a prototype and for demonstration purposes only.
