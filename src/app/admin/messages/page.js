'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '../../../../components/admin/AdminPageLayout';
import { Mail, MailOpen, Trash2, Reply, X } from 'lucide-react';

export default function MessagesAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | read

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/admin/login'); return; }
    fetchMessages();
  }, [session, status, router]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact/messages');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markRead = async (id, isRead) => {
    await fetch(`/api/contact/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead }),
    });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead } : m));
    if (selected?.id === id) setSelected(prev => ({ ...prev, isRead }));
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/contact/messages/${id}`, { method: 'DELETE' });
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openMessage = (msg) => {
    setSelected(msg);
    if (!msg.isRead) markRead(msg.id, true);
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'read') return m.isRead;
    return true;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <AdminPageLayout
      title="Messages"
      description={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">

        {/* Message list */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
          {/* Filter tabs */}
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            {['all', 'unread', 'read'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-lime-500 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {f}
                {f === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 bg-white text-lime-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
                <Mail size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No messages</p>
              </div>
            )}
            {filtered.map(msg => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`bg-white rounded-xl border cursor-pointer p-4 transition-all ${
                  selected?.id === msg.id
                    ? 'border-lime-500 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-lime-500 flex-shrink-0 mt-1"></span>
                    )}
                    <p className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {msg.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <p className={`text-xs truncate mb-1 ${!msg.isRead ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                  {msg.subject}
                </p>
                <p className="text-xs text-gray-400 truncate">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message detail */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
              <MailOpen size={48} className="mb-3 opacity-30" />
              <p className="text-sm">Select a message to read</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-gray-100">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{selected.subject}</h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                    <span>From: <span className="font-medium text-gray-700">{selected.name}</span></span>
                    <a href={`mailto:${selected.email}`} className="text-lime-600 hover:underline">{selected.email}</a>
                    <span>{new Date(selected.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                  <button
                    onClick={() => markRead(selected.id, !selected.isRead)}
                    title={selected.isRead ? 'Mark unread' : 'Mark read'}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {selected.isRead ? <Mail size={18} /> : <MailOpen size={18} />}
                  </button>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-lime-600 hover:bg-lime-50 transition-colors"
                    title="Reply via email"
                  >
                    <Reply size={18} />
                  </a>
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-5 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Reply footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Reply size={16} />
                  Reply to {selected.name}
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminPageLayout>
  );
}
