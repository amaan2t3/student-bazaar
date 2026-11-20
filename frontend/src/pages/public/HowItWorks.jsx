import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Download, 
  CreditCard, 
  ShieldCheck, 
  Upload, 
  DollarSign, 
  MessageSquare, 
  Award,
  CheckCircle2,
  FileCode2,
  Lock
} from 'lucide-react';
import Button from '../../components/common/Button';

export const HowItWorks = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-navy-mid text-xs font-bold uppercase tracking-wider bg-ivory px-3 py-1 rounded-full border border-gold-soft">
          The Platform Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How studentBazaar Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          A secure, academic-first ecosystem connecting university students across Pakistan for verified project purchases and custom assignment collaboration.
        </p>
      </div>

      {/* Pathway 1: For Students / Buyers */}
      <div className="space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">Pathway 1</span>
          <h2 className="text-2xl font-bold text-slate-900">For Buyers & Learners</h2>
          <p className="text-xs sm:text-sm text-slate-500">How to discover, buy, and download complete verified project packages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-soft/30 text-navy-mid font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Filter by Curriculum</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your Degree (BSCS, BSIT, BSSE), current semester (1 to 8), and course subject to instantly view syllabus-aligned projects.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-soft/30 text-navy-mid font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Inspect Deliverables</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review full package checklists: source code completeness, database schemas, IEEE SRS documents, diagrams, and video walkthroughs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-soft/30 text-navy-mid font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Pay Safely in PKR</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete checkout using verified Pakistani payment channels (EasyPaisa, JazzCash, or Cards) with transparent local pricing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-soft/30 text-navy-mid font-bold flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Signed Download</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive a secure, time-expiring download link directly from private cloud storage. Zero broken dependencies.
            </p>
          </div>
        </div>
      </div>

      {/* Pathway 2: For Student Creators / Sellers */}
      <div className="space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">Pathway 2</span>
          <h2 className="text-2xl font-bold text-slate-900">For Student Creators & Sellers</h2>
          <p className="text-xs sm:text-sm text-slate-500">Monetize your high-grade semester projects and FYPs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-gold-soft font-bold flex items-center justify-center text-sm">
              A
            </div>
            <h3 className="font-bold text-slate-900 text-base">Apply & Get Vetted</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your student ID card and GitHub profile. Admin verifies your credentials to protect marketplace trust.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-gold-soft font-bold flex items-center justify-center text-sm">
              B
            </div>
            <h3 className="font-bold text-slate-900 text-base">Upload or Bid</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Publish ready-made packages with documentation or place milestone proposals on custom student assignment requests.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-gold-soft font-bold flex items-center justify-center text-sm">
              C
            </div>
            <h3 className="font-bold text-slate-900 text-base">Fast Local Payouts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Withdraw earnings directly to your Pakistani bank account, JazzCash, EasyPaisa, SadaPay, or NayaPay upon order completion.
            </p>
          </div>
        </div>
      </div>

      {/* Escrow Mechanism Explainer */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-gold-soft text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Financial Protection</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold">How the Custom Project Escrow System Works</h3>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          When a buyer selects a custom project proposal, their funds are held in platform <strong>Escrow</strong>. The seller develops and delivers the work with agreed revisions. Only when the buyer verifies the code runs properly does the escrow release funds to the seller's available wallet balance. If a dispute occurs, admin arbitration steps in to safeguard both parties.
        </p>
      </div>

    </div>
  );
};

export default HowItWorks;
