import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContactMessage } from '../types/message';

interface MessagesContextType {
  messages: ContactMessage[];
  unreadCount: number;
  isInboxOpen: boolean;
  setIsInboxOpen: (open: boolean) => void;
  sendMessage: (payload: { name: string; email: string; message: string; subject?: string }) => Promise<ContactMessage>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteMessage: (id: string) => void;
  clearAllMessages: () => void;
  exportToCSV: () => void;
  exportToJSON: () => void;
  addTestMessage: () => void;
}

const STORAGE_KEY = 'shivanya_portfolio_messages_v2';

const DEFAULT_WELCOME_MESSAGE: ContactMessage = {
  id: 'msg-welcome-01',
  name: 'Shivanya Portfolio Inbox',
  email: 'shivanyamishra84@gmail.com',
  subject: 'Message Dispatch & Inbox Ready',
  message:
    'Welcome! Any direct inquiry submitted through the "Send Direct Message" form in the Connect section is captured right here. You can read, filter, reply via email, or export records as CSV/JSON.',
  timestamp: new Date().toISOString(),
  read: false,
};

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read messages from localStorage', err);
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [isInboxOpen, setIsInboxOpen] = useState(false);

  // Sync with backend API on mount
  useEffect(() => {
    let mounted = true;
    fetch('/api/messages')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((serverMessages: ContactMessage[]) => {
        if (mounted && Array.isArray(serverMessages) && serverMessages.length > 0) {
          setMessages((prev) => {
            // Merge server and local messages by ID without duplicates
            const map = new Map<string, ContactMessage>();
            serverMessages.forEach((m) => map.set(m.id, m));
            prev.forEach((m) => {
              if (!map.has(m.id)) map.set(m.id, m);
            });
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
          });
        }
      })
      .catch(() => {
        // static deployment or fallback to localStorage
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Save to localStorage whenever messages update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn('Failed to persist messages to localStorage', err);
    }
  }, [messages]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const sendMessage = useCallback(
    async (payload: { name: string; email: string; message: string; subject?: string }): Promise<ContactMessage> => {
      const newMsg: ContactMessage = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: payload.name.trim(),
        email: payload.email.trim(),
        subject: payload.subject?.trim() || `Inquiry from ${payload.name.trim()}`,
        message: payload.message.trim(),
        timestamp: new Date().toISOString(),
        read: false,
      };

      // Optimistically update state
      setMessages((prev) => [newMsg, ...prev]);

      // Also persist to server API if available
      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMsg),
        });
      } catch {
        // localStorage already saved via useEffect
      }

      return newMsg;
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
    fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: true }),
    }).catch(() => {});
  }, []);

  const markAllAsRead = useCallback(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    }).catch(() => {});
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    fetch(`/api/messages?id=${id}`, {
      method: 'DELETE',
    }).catch(() => {});
  }, []);

  const clearAllMessages = useCallback(() => {
    setMessages([]);
    fetch('/api/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearAll: true }),
    }).catch(() => {});
  }, []);

  const exportToCSV = useCallback(() => {
    if (messages.length === 0) return;
    const headers = ['ID', 'Date', 'Time', 'Sender Name', 'Sender Email', 'Subject', 'Message', 'Status'];
    const rows = messages.map((m) => {
      const d = new Date(m.timestamp);
      return [
        `"${m.id}"`,
        `"${d.toLocaleDateString()}"`,
        `"${d.toLocaleTimeString()}"`,
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.email.replace(/"/g, '""')}"`,
        `"${(m.subject || '').replace(/"/g, '""')}"`,
        `"${m.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${m.read ? 'Read' : 'Unread'}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shivanya_messages_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [messages]);

  const exportToJSON = useCallback(() => {
    if (messages.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(messages, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `shivanya_messages_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  }, [messages]);

  const addTestMessage = useCallback(() => {
    const sampleRecruiters = [
      { name: 'Sarah Jenkins', company: 'Apex Analytics', role: 'Senior Talent Partner' },
      { name: 'David Chen', company: 'FinData Solutions', role: 'Head of Analytics' },
      { name: 'Priya Sharma', company: 'Global BI Labs', role: 'Data Engineering Lead' },
    ];
    const rec = sampleRecruiters[Math.floor(Math.random() * sampleRecruiters.length)];

    sendMessage({
      name: `${rec.name} (${rec.company})`,
      email: `${rec.name.toLowerCase().replace(/\s+/g, '.')}@${rec.company.toLowerCase().replace(/\s+/g, '')}.com`,
      subject: `Opportunity: Data Analyst position at ${rec.company}`,
      message: `Hi Shivanya,\n\nI reviewed your portfolio and was particularly impressed by your DataBook tool and Power BI dashboards. We have an open Data Analyst role suited to your skills with Python and SQL. Would love to discuss this with you!`,
    });
  }, [sendMessage]);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        unreadCount,
        isInboxOpen,
        setIsInboxOpen,
        sendMessage,
        markAsRead,
        markAllAsRead,
        deleteMessage,
        clearAllMessages,
        exportToCSV,
        exportToJSON,
        addTestMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};
