// Drawer component to display AI-generated reflection for a journal entry.
import React, { useState } from 'react';
import { useLLMOutput } from '@llm-ui/react';
import { markdownLookBack } from '@llm-ui/markdown';
import MarkdownComponent from 'components/common/LlmUiMarkdownBlock';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 2. Simple AI Reflect Drawer using llm-ui markdown block
interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface AiReflectSectionProps {
  loading: boolean;
  chatHistory?: ChatMessage[];
  onSendMessage?: (message: string) => void;
}

const AiReflectSection: React.FC<AiReflectSectionProps> = ({ loading, chatHistory, onSendMessage }) => {
  const [input, setInput] = useState('');

  const safeChatHistory: ChatMessage[] = Array.isArray(chatHistory) ? chatHistory : [];

  // Find the latest AI message for typewriter effect
  const lastAiMsg = [...safeChatHistory].reverse().find(msg => msg.role === 'ai');
  const aiOutput = lastAiMsg ? lastAiMsg.content : '';

  // llm-ui typewriter effect for the latest AI message
  const { blockMatches } = useLLMOutput({
    llmOutput: aiOutput,
    blocks: [],
    fallbackBlock: {
      component: MarkdownComponent,
      lookBack: markdownLookBack(),
    },
    isStreamFinished: !loading,
  });

  return (
    <div className="h-full w-full max-w-md bg-white dark:bg-[#18181b] border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header with title */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Reflection</h3>
      </div>
      {/* Chat UI */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Render chat history: user messages and typewriter for latest AI message */}
        {safeChatHistory.map((msg, idx) => {
          if (msg.role === 'user') {
            return (
              <div key={idx} className="flex justify-end">
                <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                  {msg.content}
                </div>
              </div>
            );
          } else if (msg.role === 'ai' && msg === lastAiMsg) {
            // Only animate the latest AI message
            return (
              <div key={`ai-llm-${idx}`} className="flex justify-start">
                <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {blockMatches.map((blockMatch, i) => {
                    const Component = blockMatch.block.component;
                    return <Component key={i} blockMatch={blockMatch} />;
                  })}
                </div>
              </div>
            );
          } else if (msg.role === 'ai') {
            // Render previous AI messages instantly
            return (
              <div key={`ai-llm-${idx}`} className="flex justify-start">
                <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            );
          }
          return null;
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 max-w-[80%] text-sm">Thinking...</div>
          </div>
        )}
      </div>
      {/* Input box */}
      {onSendMessage && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-[#23232a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { onSendMessage(input); setInput(''); } }}
            disabled={loading}
          />
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
            onClick={() => { onSendMessage(input); setInput(''); }}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default AiReflectSection;
