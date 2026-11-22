import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  Archive,
  RefreshCw,
  Send,
  Eye,
  X
} from 'lucide-react';
import contactService from '../../services/contactService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchMessages = () => {
    setLoading(true);
    contactService.getAdminMessages({ status: filterStatus, search: searchQuery })
      .then((res) => {
        setMessages(res.data || []);
        if (typeof res.unreadCount === 'number') {
          setUnreadCount(res.unreadCount);
        }
      })
      .catch((err) => {
        setActionError(typeof err === 'string' ? err : 'Failed to fetch contact messages.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMessages();
  };

  const handleOpenDetail = (msg) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.admin_notes || '');
    setActionSuccess('');
    setActionError('');

    // If message is unread, automatically mark as read
    if (msg.status === 'unread') {
      contactService.updateMessageStatus(msg.id, { status: 'read' })
        .then((res) => {
          setSelectedMessage((prev) => (prev ? { ...prev, status: 'read' } : null));
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        })
        .catch(() => {});
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedMessage) return;
    setUpdating(true);
    setActionSuccess('');
    setActionError('');
    try {
      const res = await contactService.updateMessageStatus(selectedMessage.id, {
        status: newStatus,
        admin_notes: adminNotes
      });
      setActionSuccess(`Message marked as ${newStatus.toUpperCase()}.`);
      setSelectedMessage((prev) => ({ ...prev, status: newStatus, admin_notes: adminNotes }));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? { ...m, status: newStatus, admin_notes: adminNotes }
            : m
        )
      );
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to update message.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    setUpdating(true);
    setActionSuccess('');
    setActionError('');
    try {
      await contactService.updateMessageStatus(selectedMessage.id, {
        admin_notes: adminNotes
      });
      setActionSuccess('Admin notes saved successfully.');
      setSelectedMessage((prev) => ({ ...prev, admin_notes: adminNotes }));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id ? { ...m, admin_notes: adminNotes } : m
        )
      );
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to save notes.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    try {
      await contactService.deleteMessage(id);
      setActionSuccess('Message deleted.');
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to delete message.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return <Badge variant="warning">New / Unread</Badge>;
      case 'read':
        return <Badge variant="info">Read</Badge>;
      case 'replied':
        return <Badge variant="success">Replied</Badge>;
      case 'archived':
        return <Badge variant="neutral">Archived</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-gold-soft text-xs font-semibold mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Inquiries &amp; Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Contact Messages
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View, reply, and track messages sent by students, buyers, and university leads from the Contact page.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900">&times;</button>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-red-600 hover:text-red-900">&times;</button>
        </div>
      )}

      {/* Search and Filter Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          {[
            { key: 'all', label: 'All Inquiries' },
            { key: 'unread', label: 'Unread' },
            { key: 'read', label: 'Read' },
            { key: 'replied', label: 'Replied' },
            { key: 'archived', label: 'Archived' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === tab.key
                  ? 'bg-[#101827] text-[#D6B779]'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search sender, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </form>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No messages found</p>
          <p className="text-xs text-slate-400">
            {filterStatus !== 'all' ? `No messages matching status '${filterStatus}'.` : 'No one has submitted a contact message yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenDetail(msg)}
              className={`p-5 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                msg.status === 'unread' ? 'bg-amber-50/40 font-medium' : ''
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 truncate">{msg.name}</span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs text-slate-500">{msg.email}</span>
                  {msg.phone && (
                    <>
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="text-xs text-slate-500">{msg.phone}</span>
                    </>
                  )}
                  {getStatusBadge(msg.status)}
                </div>
                <h4 className="text-xs font-semibold text-slate-800 truncate">{msg.subject}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{msg.message}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Message Detail</span>
                {getStatusBadge(selectedMessage.status)}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{selectedMessage.subject}</h2>
              <p className="text-xs text-slate-400">
                Received on {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>

            {/* Sender Details Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="block text-slate-400 font-semibold uppercase tracking-wider">Sender Name</span>
                <span className="font-bold text-slate-800">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-semibold uppercase tracking-wider">Email Address</span>
                <a href={`mailto:${selectedMessage.email}`} className="font-bold text-sky-600 hover:underline break-all">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <span className="block text-slate-400 font-semibold uppercase tracking-wider">Phone / WhatsApp</span>
                <span className="font-bold text-slate-800">{selectedMessage.phone || 'Not provided'}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Message Content
              </label>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Internal Admin Notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add private administrative notes (e.g. Followed up on WhatsApp, verified student ID)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveNotes}
                  disabled={updating}
                >
                  Save Notes
                </Button>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500 mr-1">Status:</span>
                <button
                  onClick={() => handleStatusChange('unread')}
                  disabled={updating}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100"
                >
                  Unread
                </button>
                <button
                  onClick={() => handleStatusChange('read')}
                  disabled={updating}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100"
                >
                  Read
                </button>
                <button
                  onClick={() => handleStatusChange('replied')}
                  disabled={updating}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                >
                  Replied
                </button>
                <button
                  onClick={() => handleStatusChange('archived')}
                  disabled={updating}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Archive
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}&body=Dear ${encodeURIComponent(selectedMessage.name)},%0D%0A%0D%0AThank you for reaching out to studentBazaar.%0D%0A%0D%0A`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#101827] text-[#D6B779] hover:bg-[#1B2940] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ContactMessages;
