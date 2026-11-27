import React, { useState, useEffect } from 'react';
import {
  Users,
  Linkedin,
  Github,
  Twitter,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code
} from 'lucide-react';
import teamService from '../../services/teamService';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

export const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    teamService.getTeamMembers()
      .then((res) => {
        if (active) {
          setTeamMembers(res.data || []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(typeof err === 'string' ? err : 'Unable to load team members.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* ── Page Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] text-[#D6B779] text-xs font-semibold tracking-wide uppercase">
             Leadership &amp; Engineering
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Meet the Team Powering <span className="text-[#101827]">student</span><span className="text-[#D6B779]">Bazaar</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            We are students, software engineers, and campus researchers from top Pakistani institutions committed to revolutionizing how CS &amp; IT undergraduates share, learn, and monetize high-grade academic code.
          </p>
        </div>

        {/* ── Team Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto" />
                <div className="h-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center text-sm">
            {error}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No team members listed yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#D6B779]/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4 text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mx-auto">
                    <img
                      src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={member.name}
                      className="w-28 h-28 rounded-full object-cover border-4 border-[#F8F5ED] shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#101827] text-[#D6B779] shadow-sm">
                      <Code className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#101827]">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#D6B779] mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  {/* University */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.university}</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-500 leading-relaxed text-left line-clamp-4 pt-1">
                    {member.bio}
                  </p>
                </div>

                {/* Social links */}
                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-center gap-3 text-slate-400">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-slate-100 hover:text-[#0A66C2] transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a
                      href={member.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-slate-100 hover:text-sky-500 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Values Banner ── */}
        <div className="bg-[#101827] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#D6B779]/10 text-[#D6B779] flex items-center justify-center mx-auto md:mx-0">
             </div>
            <h4 className="text-lg font-bold text-white">Strict Academic Rigor</h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Every project is screened against university guidelines, plagiarism ethics, and architectural standards.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#D6B779]/10 text-[#D6B779] flex items-center justify-center mx-auto md:mx-0">
             </div>
            <h4 className="text-lg font-bold text-white">Empowering Student Sellers</h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Top students can monetize verified lab work, final year projects, and semester coursework through local PKR payouts.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#D6B779]/10 text-[#D6B779] flex items-center justify-center mx-auto md:mx-0">
             </div>
            <h4 className="text-lg font-bold text-white">Campus Ambassador Program</h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Represent studentBazaar at FAST, NUST, PUCIT, COMSATS, UET, and GIKI to earn stipends and developer perks.
            </p>
          </div>
        </div>

        {/* ── Contact CTA ── */}
        <div className="text-center bg-[#F8F5ED] rounded-3xl p-10 border border-[#D6B779]/30 space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">Want to join or collaborate with our team?</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Whether you want to build campus integrations, become a lead seller, or write technical solutions, we’d love to connect.
          </p>
          <div className="pt-2">
            <Link to="/contact">
              <Button className="px-6 py-3 font-semibold inline-flex items-center gap-2">
                Get in Touch via Contact Page
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurTeam;
