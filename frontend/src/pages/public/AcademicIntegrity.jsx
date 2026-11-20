import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, BookOpen } from 'lucide-react';

export const AcademicIntegrity = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-soft/30 text-navy text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-navy-mid" />
          <span>Ethics & Fair Use Standard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Academic Integrity & Learning Policy
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          studentBazaar is built to empower Pakistani computing students to understand complex system architectures and accelerate their software development skills.
        </p>
      </div>

      {/* Core Principle */}
      <div className="bg-ivory border border-gold-soft rounded-2xl p-6 text-navy text-xs sm:text-sm leading-relaxed space-y-2">
        <h3 className="font-bold text-emerald-900 text-base">The Core Learning Mission</h3>
        <p>
          In engineering and computing curricula, studying production-quality source code and reading standardized IEEE Software Requirements Specifications (SRS) is one of the most effective pedagogical methods to master practical programming.
        </p>
        <p>
          However, purchasing a project to falsely submit it as one's own independent, unaided creation where prohibited violates university honor codes.
        </p>
      </div>

      {/* Permitted vs Prohibited Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Permitted Use */}
        <div className="bg-white rounded-2xl border border-green-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-green-700 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <span>Permitted & Encouraged Use</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">&bull;</span>
              <span><strong>Reference Architecture:</strong> Studying how classes, routes, models, and controllers are structured in a professional application.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">&bull;</span>
              <span><strong>Database Normalization Study:</strong> Inspecting 3NF schemas, stored procedures, and triggers to master relational design.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">&bull;</span>
              <span><strong>Viva & Defense Preparation:</strong> Using included presentation slides and README files to understand how to explain design decisions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">&bull;</span>
              <span><strong>Boilerplate Frameworks:</strong> Modifying and extending open/authorized starter packages with your own original logic.</span>
            </li>
          </ul>
        </div>

        {/* Prohibited Misconduct */}
        <div className="bg-white rounded-2xl border border-red-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-red-700 font-bold text-base">
            <XCircle className="w-5 h-5" />
            <span>Strictly Prohibited Misconduct</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">&bull;</span>
              <span><strong>Plagiarized Submission:</strong> Submitting a downloaded project without attribution or permission as your own unique assignment.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">&bull;</span>
              <span><strong>Live Exam Impersonation:</strong> Requesting real-time assistance during live timed quizzes, midterms, or final examinations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">&bull;</span>
              <span><strong>Copyright Infringement:</strong> Re-uploading or selling another student's proprietary source code without authorization.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">&bull;</span>
              <span><strong>Malicious Code:</strong> Uploading executable files containing malware, trojans, backdoors, or malicious scripts.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Enforcement */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-900 text-sm">Platform Governance & Disciplinary Actions</h4>
        <p>
          studentBazaar reserves the right to immediately terminate user accounts, ban payout privileges, and remove project listings that violate these principles. Sellers must warrant that they own or are authorized to distribute uploaded project archives.
        </p>
      </div>

    </div>
  );
};

export default AcademicIntegrity;
