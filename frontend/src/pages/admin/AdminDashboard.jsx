import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  ClipboardCheck,
  FolderCheck,
  FolderPlus,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Users,
  Settings
} from 'lucide-react';
import adminService from '../../services/adminService';

const adminSections = [
  {
    title: 'Manage Ready-Made Projects',
    description: 'Review listings, publish seller projects, and manage the ready-made catalog.',
    to: '/admin/projects',
    icon: FolderCheck
  },
  {
    title: 'Add Ready-Made Project',
    description: 'Create and publish a project directly from the admin panel.',
    to: '/admin/projects/new',
    icon: FolderPlus
  },
  {
    title: 'Buyer Custom Requests',
    description: 'Review requests and approve them for seller bidding or reject them.',
    to: '/admin/custom-requests',
    icon: ClipboardCheck
  },
  {
    title: 'Seller Applications',
    description: 'Verify seller credentials and approve or reject applications.',
    to: '/admin/seller-applications',
    icon: UserCheck
  },
  {
    title: 'Contact Messages & Inquiries',
    description: 'Read and respond to inquiries submitted by students and buyers from the Contact page.',
    to: '/admin/contact-messages',
    icon: MessageSquare,
    badgeKey: 'unread_contact_messages'
  },
  {
    title: 'Manage Our Team',
    description: 'Add, edit, reorder, or remove team members and campus leads displayed on Our Team page.',
    to: '/admin/team',
    icon: Users
  },
  {
    title: 'Contact Page Settings',
    description: 'Update support email, phone numbers, university hub address, and operating hours.',
    to: '/admin/contact-settings',
    icon: Settings
  }
];

const formatPKR = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`;

export const AdminDashboard = () => {
  const [totals, setTotals] = useState(null);
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    let active = true;
    adminService.getDashboardStats()
      .then((data) => {
        if (active) setTotals(data);
      })
      .catch((error) => {
        if (active) setStatsError(typeof error === 'string' ? error : 'Failed to load dashboard totals.');
      })
      .finally(() => {
        if (active) setLoadingTotals(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <header className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-gold-soft text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Admin Control Panel
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Administration Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage projects, buyer requests, seller applications, contact inquiries, team members, and platform totals.</p>
      </header>

      {statsError && (
        <div role="alert" className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {statsError}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Platform totals">
        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Paid order revenue</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {loadingTotals ? 'Loading…' : formatPKR(totals?.total_paid_revenue)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Sum of orders marked paid.</p>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total custom request budgets</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {loadingTotals ? 'Loading…' : formatPKR(totals?.total_request_budget)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Combined budgets submitted by buyers.</p>
        </article>

        <Link
          to="/admin/contact-messages"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#D6B779] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">New Contact Inquiries</p>
            {totals?.unread_contact_messages > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            {loadingTotals ? 'Loading…' : (totals?.unread_contact_messages ?? 0)}
            <span className="text-xs font-normal text-slate-400">unread</span>
          </p>
          <p className="mt-1 text-xs text-amber-600 font-medium group-hover:underline">
            View incoming messages &rarr;
          </p>
        </Link>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Admin tools">
        {adminSections.map(({ title, description, to, icon: Icon, badgeKey }) => {
          const badgeVal = badgeKey && totals ? totals[badgeKey] : null;

          return (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-gold hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-ivory text-navy flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  {badgeVal > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                      {badgeVal} new
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-slate-900 group-hover:text-black">{title}</h2>
                <p className="text-sm text-slate-500 mt-2 min-h-10">{description}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy-mid mt-4">
                Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
};

export default AdminDashboard;
