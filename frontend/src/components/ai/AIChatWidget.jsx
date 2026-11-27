import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  LoaderCircle,
  MessageCircle,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function AIChatWidget() {
  const { user, isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm your NammaYatra Travel Companion. 🌍\n\nPlanning a weekend getaway, exploring destinations, or looking for a journey within your budget? I'm here to help!\n\nWhere would you like to travel?",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Automatically scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  // Focus input when the chat opens.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Show the assistant only to authenticated passengers.
  if (!isAuthenticated || user?.role !== 'PASSENGER') {
    return null;
  }

  async function handleSendMessage(e) {
    e.preventDefault();

    const message = input.trim();

    if (!message || isLoading) return;

    // Display the user's message immediately.
    setMessages((previous) => [
      ...previous,
      {
        role: 'user',
        content: message,
      },
    ]);

    setInput('');
    setIsLoading(true);

    try {
      // Collect the previous conversation messages.
      const history = messages
        .filter(
          (msg) =>
            msg.role === 'user' ||
            msg.role === 'assistant'
        )
        .slice(-20)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Send the latest message along with conversation history.
      const response = await api.post('/api/ai/chat', {
        message,
        history,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: response.data.reply,
          sources: response.data.sources || [],
        },
      ]);
    } catch (error) {
      console.error('AI Chat Error:', error);

      let errorMessage =
        'Sorry, I could not process your request. Please try again.';

      if (error.response?.status === 401) {
        errorMessage =
          'Your session may have expired. Please log in again.';
      } else if (error.response?.status === 429) {
        errorMessage =
          'The AI service is receiving too many requests. Please try again shortly.';
      } else if (!error.response) {
        errorMessage =
          'Unable to connect to the server. Please check your internet connection or try again later.';
      }

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Travel Companion"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <Sparkles size={22} />

          <span className="text-sm font-bold">
            AI Travel Companion
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(680px,85vh)] w-[min(410px,calc(100vw-40px))] flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4 text-white">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                <Sparkles size={23} />
              </div>

              <div>
                <h2 className="font-bold">
                  NammaYatra AI
                </h2>

                <p className="text-xs text-white/85">
                  Your personal travel companion
                </p>
              </div>

            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-2 transition hover:bg-white/20"
            >
              <X size={22} />
            </button>

          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto bg-orange-50/40 p-4">

            <div className="mb-2 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
              <MessageCircle size={13} />
              Your travel conversation starts here
            </div>

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.role === 'user'
                    ? 'flex-row-reverse'
                    : 'flex-row'
                }`}
              >

                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === 'assistant'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot size={17} />
                  ) : (
                    <User size={17} />
                  )}
                </div>

                {/* Message Bubble and Sources */}
                <div className="flex max-w-[82%] flex-col gap-2">

                  <div
                    className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'assistant'
                        ? 'rounded-tl-sm bg-white text-gray-800 shadow-sm'
                        : 'rounded-tr-sm bg-orange-500 text-white'
                    }`}
                  >
                    {message.content}
                  </div>

                  {/* External Search Sources */}
                  {message.role === 'assistant' &&
                    message.sources?.length > 0 && (
                      <div className="rounded-xl border border-orange-100 bg-white p-3 shadow-sm">

                        <p className="mb-2 text-xs font-bold text-gray-600">
                          🔎 Sources used
                        </p>

                        <div className="space-y-2">

                          {message.sources.map((source, sourceIndex) => (
                            <a
                              key={`${source.url}-${sourceIndex}`}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block break-words text-xs text-orange-600 underline decoration-orange-200 underline-offset-2 transition hover:text-orange-800"
                            >
                              {source.title}
                            </a>
                          ))}

                        </div>
                      </div>
                    )}

                </div>

              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Bot size={17} />
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                  Planning your journey...
                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-orange-100 bg-white p-4"
          >

            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Where would you like to go?"
                maxLength={4000}
                disabled={isLoading}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} />
              </button>

            </div>





   <p className="mt-2 text-center text-[10px] text-gray-400">
              AI suggestions may include estimates. Verify travel details before booking.
            </p>

          </form>

        </div>
      )}
    </>
  );
}

export default AIChatWidget;


