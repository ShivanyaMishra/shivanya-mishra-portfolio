import React, { useState, useMemo } from 'react';
import {
  X,
  Mail,
  Search,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Download,
  Send,
  Inbox as InboxIcon,
  Clock,
  User,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useMessages } from '../context/MessagesContext';
import { ContactMessage } from '../types/message';

export const MessagesInboxModal: React.FC = () => {
  const {
    messages,
    unreadCount,
    isInboxOpen,
    setIsInboxOpen,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    clearAllMessages,
    exportToCSV,
    exportToJSON,
    addTestMessage,
  } = useMessages();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Close on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsInboxOpen(false);
      }
    };
    if (isInboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInboxOpen, setIsInboxOpen]);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filterType === 'unread' && m.read) return false;
      if (filterType === 'read' && !m.read) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        (m.subject && m.subject.toLowerCase().includes(q))
      );
    });
  }, [messages, searchQuery, filterType]);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let relative = '';
      if (diffMins < 1) relative = 'Just now';
      else if (diffMins < 60) relative = `${diffMins}m ago`;
      else if (diffHours < 24) relative = `${diffHours}h ago`;
      else if (diffDays < 7) relative = `${diffDays}d ago`;
      else relative = date.toLocaleDateString();

      return {
        relative,
        full: `${date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })} at ${date.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      };
    } catch {
      return { relative: 'Recently', full: iso };
    }
  };

  if (!isInboxOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div
        className="absolute inset-0"
        onClick={() => setIsInboxOpen(false)}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#080d1a] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#060a14] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <InboxIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-tight">
                  RECEIVED MESSAGES INBOX
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                All inquiries submitted through &ldquo;Send Direct Message&rdquo; are received and managed here.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInboxOpen(false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:px-6 sm:py-3.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sender, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'unread'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilterType('read')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'read'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Read ({messages.length - unreadCount})
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="ml-2 text-[11px] text-cyan-400 hover:text-cyan-300 underline"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-mono font-medium text-slate-300">
                {messages.length === 0 ? 'No Messages Received Yet' : 'No matching messages found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Inquiries sent from the &ldquo;Send Direct Message&rdquo; form appear here immediately.
              </p>
              <button
                onClick={addTestMessage}
                className="mt-2 px-3.5 py-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 rounded-lg hover:bg-cyan-900 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Recruiter Message</span>
              </button>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const time = formatTimestamp(msg.timestamp);
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    if (!msg.read) markAsRead(msg.id);
                  }}
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    !msg.read
                      ? 'bg-[#0d1627]/90 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                      : 'bg-[#090e1b]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Message Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-xs font-mono font-bold text-cyan-300">
                        {msg.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{msg.name}</span>
                          {!msg.read ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500 text-slate-950">
                              NEW
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">Read</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <a
                            href={`mailto:${msg.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-cyan-400 transition-colors underline"
                          >
                            {msg.email}
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyEmail(msg.email, msg.id);
                            }}
                            className="text-slate-400 hover:text-white"
                            title="Copy email"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span title={time.full}>{time.relative}</span>
                      <span className="hidden md:inline text-slate-500">• {time.full}</span>
                    </div>
                  </div>

                  {/* Subject line (if any) */}
                  {msg.subject && (
                    <div className="pt-2 text-xs font-mono font-semibold text-cyan-300">
                      {msg.subject}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="pt-2 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                    {msg.message}
                  </div>

                  {/* Action Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Direct reply via email client */}
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(
                          `Re: ${msg.subject || 'Portfolio Inquiry'}`
                        )}&body=${encodeURIComponent(
                          `Hi ${msg.name},\n\nThank you for reaching out regarding:\n> "${msg.message}"\n\nBest regards,\nShivanya Mishra\nData Analyst\nshivanyamishra84@gmail.com\n+91 8447402891`
                        )}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>

                      {!msg.read ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(msg.id);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-colors"
                        >
                          Mark as read
                        </button>
                      ) : null}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(msg.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded hover:bg-rose-950/30"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Management Footer */}
        <div className="p-3 sm:px-6 sm:py-4 bg-[#060a14] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">
              Direct email recipient:{' '}
              <strong className="text-white">shivanyamishra84@gmail.com</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={addTestMessage}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 rounded transition-colors flex items-center gap-1 text-[11px]"
              title="Add sample message to test UI"
            >
              <Sparkles className="w-3 h-3" />
              <span>Test Msg</span>
            </button>

            <button
              onClick={exportToCSV}
              disabled={messages.length === 0}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded transition-colors flex items-center gap-1 text-[11px] disabled:opacity-40"
              title="Download inquiries as spreadsheet CSV"
            >
              <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={exportToJSON}
              disabled={messages.length === 0}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded transition-colors flex items-center gap-1 text-[11px] disabled:opacity-40"
              title="Download inquiries as JSON"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>JSON</span>
            </button>

            {messages.length > 0 && (
              <>
                {confirmClear ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        clearAllMessages();
                        setConfirmClear(false);
                      }}
                      className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px]"
                    >
                      Confirm Clear
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-2 py-1 bg-slate-800 text-slate-400 hover:text-white rounded text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Clear all messages"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
