import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import logo from '../../assets/logo1.jpeg';

export const Footer = () => {
  return (
    <footer className="bg-[#101827] text-slate-400 text-sm border-t border-[#1B2940]">
      {/* Academic Integrity Banner */}
      <div className="bg-[#1B2940] border-b border-[#D6B779]/20 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#E9D9B5]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#D6B779] shrink-0" />
            <span>
              <strong>Academic Integrity Notice:</strong> All digital assets on studentBazaar are designed as architectural references, study frameworks, and learning solutions.
            </span>
          </div>
          <Link to="/academic-integrity" className="underline hover:text-white font-medium shrink-0">
            Read Permitted Educational Use Policy &rarr;
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="StudentBazaar" className="h-10 w-auto" />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Pakistan's first dedicated digital marketplace for university Computer Science and Information Technology projects. Helping students learn system architecture, run verified code, and earn from their intellectual work.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Transactions natively verified in <strong>Pakistani Rupees (PKR)</strong>.
            </div>
          </div>

          {/* Computing Degrees */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">By Degree</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/browse?degree=BSCS" className="hover:text-[#D6B779] transition-colors">BS Computer Science</Link></li>
              <li><Link to="/browse?degree=BSIT" className="hover:text-[#D6B779] transition-colors">BS Information Technology</Link></li>
              <li><Link to="/browse?degree=BSSE" className="hover:text-[#D6B779] transition-colors">BS Software Engineering</Link></li>
              <li><Link to="/browse?degree=BSAI" className="hover:text-[#D6B779] transition-colors">BS Artificial Intelligence</Link></li>
              <li><Link to="/browse?degree=BSDS" className="hover:text-[#D6B779] transition-colors">BS Data Science</Link></li>
            </ul>
          </div>

          {/* Quick Subjects */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Core Subjects</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/browse?subject=Database+Systems" className="hover:text-[#D6B779] transition-colors">Database Systems (DBMS)</Link></li>
              <li><Link to="/browse?subject=Web+Engineering" className="hover:text-[#D6B779] transition-colors">Web Engineering (MERN)</Link></li>
              <li><Link to="/browse?subject=Data+Structures+and+Algorithms" className="hover:text-[#D6B779] transition-colors">Data Structures (DSA)</Link></li>
              <li><Link to="/browse?subject=Object+Oriented+Programming" className="hover:text-[#D6B779] transition-colors">OOP in C++ &amp; Java</Link></li>
              <li><Link to="/browse?subject=Artificial+Intelligence" className="hover:text-[#D6B779] transition-colors">Machine Learning &amp; AI</Link></li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/custom-request" className="hover:text-[#D6B779] transition-colors">Request Custom Project</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#D6B779] transition-colors">How It Works</Link></li>
              <li><Link to="/academic-integrity" className="hover:text-[#D6B779] transition-colors">Academic Integrity</Link></li>
              <li><span className="text-[#D6B779] font-medium">PKR Payouts (JazzCash/EasyPaisa)</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="border-t border-[#1B2940] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} StudentBazaar. Built for BSIT / BSCS Students across Pakistan.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Powered by studentBazaar</span> 
            <span>&bull;</span>
            <span>Private Storage Vault</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
