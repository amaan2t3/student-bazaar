import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import logo from '../../assets/Logo.jpeg';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block focus:outline-none">
              <img src={logo} alt="StudentBazaar" className="h-9 w-auto rounded border border-slate-800" />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Pakistan's dedicated computing project repository. Providing verified source code, normalized database schemas, and IEEE-format documentation for university students and educators.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Transacted natively in Pakistani Rupees (PKR)</span>
            </div>
          </div>

          {/* Computing Degrees (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-slate-200 text-xs font-semibold uppercase tracking-wider font-mono">Degree Programs</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/browse?degree=BSCS" className="hover:text-slate-200 transition-colors">BS Computer Science</Link></li>
              <li><Link to="/browse?degree=BSSE" className="hover:text-slate-200 transition-colors">BS Software Engineering</Link></li>
              <li><Link to="/browse?degree=BSIT" className="hover:text-slate-200 transition-colors">BS Information Technology</Link></li>
              <li><Link to="/browse?degree=BSAI" className="hover:text-slate-200 transition-colors">BS Artificial Intelligence</Link></li>
              <li><Link to="/browse?degree=BSDS" className="hover:text-slate-200 transition-colors">BS Data Science</Link></li>
            </ul>
          </div>

          {/* Quick Subjects (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-slate-200 text-xs font-semibold uppercase tracking-wider font-mono">Curricular Subjects</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/browse?subject=Database+Systems" className="hover:text-slate-200 transition-colors">Database Systems (DBMS &amp; SQL)</Link></li>
              <li><Link to="/browse?subject=Web+Engineering" className="hover:text-slate-200 transition-colors">Web Engineering &amp; REST APIs</Link></li>
              <li><Link to="/browse?subject=Data+Structures+and+Algorithms" className="hover:text-slate-200 transition-colors">Data Structures &amp; Algorithms</Link></li>
              <li><Link to="/browse?subject=Object+Oriented+Programming" className="hover:text-slate-200 transition-colors">Object-Oriented Programming (C++/Java)</Link></li>
              <li><Link to="/browse?subject=Artificial+Intelligence" className="hover:text-slate-200 transition-colors">Machine Learning &amp; AI</Link></li>
            </ul>
          </div>

          {/* Platform & Governance (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-slate-200 text-xs font-semibold uppercase tracking-wider font-mono">Platform Standards</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/custom-request" className="hover:text-slate-200 transition-colors">Custom Project Requests</Link></li>
              <li><Link to="/how-it-works" className="hover:text-slate-200 transition-colors">How It Works</Link></li>
              <li><Link to="/academic-integrity" className="hover:text-slate-200 transition-colors">Academic Integrity Policy</Link></li>
              <li><Link to="/team" className="hover:text-slate-200 transition-colors">Our Team</Link></li>
              <li><Link to="/contact" className="hover:text-slate-200 transition-colors">Contact &amp; Support</Link></li>
              <li className="pt-1 text-[11px] text-slate-400 font-mono">
                Payout Channels: JazzCash &bull; EasyPaisa &bull; Bank
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Legal & Honor Code Bar */}
        <div className="border-t border-slate-850 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} StudentBazaar. Academic Repository for Computing Students in Pakistan.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/academic-integrity" className="hover:text-slate-300 transition-colors">
              Honor Code Policy
            </Link>
            <span>&bull;</span>
            <span>Pre-Signed Secure Storage</span>
            <span>&bull;</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Escrow</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
