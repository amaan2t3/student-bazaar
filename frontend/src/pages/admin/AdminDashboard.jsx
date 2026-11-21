import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, FolderCheck, ShieldCheck, UserCheck } from 'lucide-react';

const adminSections = [
  {
    title: 'Ready-Made Project Approvals',
    description: 'Review submitted project listings and approve or reject them before publication.',
    to: '/admin/project-moderation',
    icon: FolderCheck
  },
  {
    title: 'Buyer Custom Requests',
    description: 'Review custom project requests and approve them for seller bidding or reject them.',
    to: '/admin/custom-requests',
    icon: ClipboardCheck
  },
  {
    title: 'Seller Applications',
    description: 'Verify seller credentials and approve or reject applications.',
    to: '/admin/seller-applications',
    icon: UserCheck
  }
];

export const AdminDashboard = () => (
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
    <header className="pb-4 border-b border-slate-200">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-gold-soft text-xs font-semibold mb-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        Admin Control Panel
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Administration Dashboard</h1>
      <p className="text-sm text-slate-500 mt-1">Manage project listings, buyer requests, and seller applications.</p>
    </header>

    <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Admin review queues">
      {adminSections.map(({ title, description, to, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-gold hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-ivory text-navy flex items-center justify-center mb-4">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-2 min-h-10">{description}</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy-mid mt-4">
            Open queue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      ))}
    </section>
  </main>
);

export default AdminDashboard;
