'use client';

import { useState, useEffect } from 'react';
import RetroCard from '@/components/RetroCard';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  timestamp: number;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const GUESTBOOK_PASSWORD = 'pixel2026'; // Change this to your desired password

  // Load messages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('guestbook_messages');
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse messages:', e);
      }
    }
    setLoading(false);
  }, []);

  // Save messages to localStorage
  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem('guestbook_messages', JSON.stringify(newMessages));
    setMessages(newMessages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      timestamp: Date.now(),
    };

    const updated = [newMessage, ...messages];
    saveMessages(updated);
    setInput('');
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 2000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInput === GUESTBOOK_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('❌ Wrong password!');
      setPasswordInput('');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteClick = (messageId: string) => {
    setDeleteConfirm(messageId);
  };

  const handleConfirmDelete = (messageId: string) => {
    const updated = messages.filter(msg => msg.id !== messageId);
    saveMessages(updated);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFB6D9] via-pastel-pink to-[#FFC0CB] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-3xl font-bold text-pastel-yellow" style={{ fontFamily: 'var(--font-press)' }}>
            💬 GUESTBOOK
          </h1>
          <p className="text-[10px] sm:text-xs text-pastel-purple font-bold">
            Send an anonymous message!
          </p>
        </div>

        {/* Submit Form */}
        <RetroCard className="flex flex-col gap-3 sm:gap-4">
          <h2 className="text-[10px] sm:text-xs font-bold text-pastel-purple">
            ✍️ YOUR MESSAGE
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write something nice... (max 200 chars)"
              maxLength={200}
              className="w-full p-2 sm:p-3 border-2 border-black text-[9px] sm:text-xs font-bold resize-none h-20 sm:h-24 placeholder-gray-500"
            />

            <div className="flex justify-between items-center text-[8px] sm:text-[9px] text-gray-600 font-bold">
              <span>{input.length}/200</span>
            </div>

            <button
              type="submit"
              disabled={!input.trim()}
              className="w-full p-2 sm:p-3 bg-pastel-blue text-black border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 disabled:opacity-50 transition-all"
            >
              SEND MESSAGE 🚀
            </button>
          </form>

          {submitted && (
            <div className="p-2 sm:p-3 bg-pastel-mint border-2 border-black text-[8px] sm:text-[9px] font-bold text-center">
              ✓ Message sent! Thanks for the love 💕
            </div>
          )}
        </RetroCard>

        {/* Password Protection for Viewing Messages */}
        {!isAuthenticated && (
          <RetroCard className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-[10px] sm:text-xs font-bold text-pastel-yellow text-center">
              🔐 PRIVATE MESSAGES
            </h2>
            <p className="text-[8px] sm:text-[9px] text-center text-pastel-blue font-bold">
              Enter password to view all messages
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-2 sm:space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password..."
                className="w-full p-2 sm:p-3 border-2 border-black text-[9px] sm:text-xs font-bold placeholder-gray-500"
              />
              
              {passwordError && (
                <p className="text-[8px] sm:text-[9px] text-red-500 font-bold text-center">{passwordError}</p>
              )}
              
              <button
                type="submit"
                className="w-full p-2 sm:p-3 bg-pastel-yellow text-black border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-opacity-80 transition-all"
              >
                UNLOCK 🔓
              </button>
            </form>
          </RetroCard>
        )}

        {/* Messages List - Only shows if authenticated */}
        {isAuthenticated && (
          <div>
            <h2 className="text-[10px] sm:text-xs font-bold text-pastel-yellow mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-press)' }}>
              📖 ALL MESSAGES ({messages.length})
            </h2>

            {loading ? (
              <RetroCard>
                <p className="text-[8px] sm:text-[9px] text-pastel-purple font-bold">Loading messages...</p>
              </RetroCard>
            ) : messages.length === 0 ? (
              <RetroCard>
                <p className="text-[8px] sm:text-[9px] text-pastel-purple font-bold text-center">
                  No messages yet... Be the first! 👋
                </p>
              </RetroCard>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {messages.map((msg) => (
                  <RetroCard key={msg.id} className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-[9px] sm:text-xs font-bold text-pastel-blue break-words flex-1 whitespace-pre-wrap">
                        {msg.text}
                      </p>
                      <button
                        onClick={() => handleDeleteClick(msg.id)}
                        className="flex-shrink-0 px-2 py-1 bg-red-400 text-white border border-red-600 text-[8px] font-bold hover:bg-red-500 transition-all"
                        title="Delete this message"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-pastel-blue font-bold">
                      {formatTime(msg.timestamp)}
                    </p>
                  </RetroCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <Link href="/">
          <button className="w-full p-2 sm:p-3 bg-pastel-purple text-black border-2 border-black font-bold text-[9px] sm:text-xs hover:bg-pastel-blue transition-all">
            ← BACK HOME
          </button>
        </Link>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <RetroCard className="max-w-xs space-y-4">
              <h3 className="text-[10px] sm:text-xs font-bold text-red-500 text-center">
                ⚠️ DELETE MESSAGE?
              </h3>
              <p className="text-[9px] sm:text-xs text-pastel-blue font-bold text-center">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 p-2 sm:p-3 bg-pastel-blue text-black border-2 border-black font-bold text-[8px] sm:text-xs hover:bg-opacity-80 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleConfirmDelete(deleteConfirm)}
                  className="flex-1 p-2 sm:p-3 bg-red-400 text-white border-2 border-red-600 font-bold text-[8px] sm:text-xs hover:bg-red-500 transition-all"
                >
                  DELETE
                </button>
              </div>
            </RetroCard>
          </div>
        )}
      </div>
    </div>
  );
}
