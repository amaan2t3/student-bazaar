import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Github, 
  Globe, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  UserCheck,
  Search,
  Filter
} from 'lucide-react';
import sellerService from '../../services/sellerService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const SellerApplicationsReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchApplications = () => {
    setLoading(true);
    sellerService.getAdminApplications()
      .then(res => {
        setApplications(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setActionError(typeof err === 'string' ? err : 'Failed to load seller applications.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReviewAction = async (id, status) => {
    setActionSuccess('');
    setActionError('');
    try {
      const feedback = status === 'rejected' ? 'Incomplete GitHub repository documentation or unverified student ID.' : 'Approved: Academic and code credentials verified.';
      await sellerService.reviewApplication(id, status, feedback);
      setActionSuccess(`Application #${id} has been marked as ${status.toUpperCase()}!`);
      fetchApplications();
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to review application.');
    }
  };

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-gold-soft text-xs font-semibold mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Admin Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Seller Vetting & Credential Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verify student ID cards, GitHub repositories, and academic standing before granting project publishing rights.
          </p>
        </div>

      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-ivory border border-gold-soft rounded-xl text-xs text-navy flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Applications ({applications.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Review ({applications.filter(a => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'approved' ? 'bg-gold text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Approved ({applications.filter(a => a.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rejected ({applications.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading seller applications...</div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
          No seller applications found under this status.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div 
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Student Details */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">
                    {app.user_name || app.profile?.full_name || 'Student Applicant'}
                  </span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {app.user_email || app.profile?.email}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    app.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : app.status === 'rejected' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="font-semibold text-navy-mid bg-ivory px-2 py-0.5 rounded">
                    {app.university || app.profile?.university || 'University'}
                  </span>
                  <span>Degree: <strong>{app.degree || app.profile?.degree || 'BSCS'}</strong></span>
                  <span>Semester: <strong>{app.semester || app.profile?.semester || 4}</strong></span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-400">Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                </div>

                {app.bio && (
                  <p className="text-xs text-slate-600 leading-relaxed italic max-w-2xl bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    "{app.bio}"
                  </p>
                )}

                {/* Specializations & Links */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={app.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-gold font-medium bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View GitHub Profile</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {app.portfolio_url && (
                    <a
                      href={app.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-gold font-medium bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Portfolio</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}

                  {/* Skills */}
                  {app.specializations?.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-ivory text-navy font-semibold px-2 py-0.5 rounded border border-gold-soft">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0">
                {app.status === 'pending' ? (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full sm:w-auto"
                      onClick={() => handleReviewAction(app.id, 'approved')}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Approve & Grant Seller Role
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="w-full sm:w-auto"
                      onClick={() => handleReviewAction(app.id, 'rejected')}
                      leftIcon={<XCircle className="w-4 h-4" />}
                    >
                      Reject Application
                    </Button>
                  </>
                ) : (
                  <div className="text-right text-xs text-slate-500">
                    <div>Decision: <strong className="capitalize text-slate-800">{app.status}</strong></div>
                    {app.admin_feedback && (
                      <div className="text-[11px] text-slate-400 mt-0.5 max-w-xs">{app.admin_feedback}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SellerApplicationsReview;
