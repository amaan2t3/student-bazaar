import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  Package, 
  FileCode2, 
  Database, 
  FileText,
  DollarSign
} from 'lucide-react';
import projectService from '../../services/projectService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const ProjectModeration = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchModerationQueue = () => {
    setLoading(true);
    projectService.getAdminModerationQueue()
      .then(res => {
        setProjects(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setActionError(typeof err === 'string' ? err : 'Failed to load project queue.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchModerationQueue();
  }, []);

  const handleModerateAction = async (id, status) => {
    setActionSuccess('');
    setActionError('');
    try {
      const feedback = status === 'approved' 
        ? 'Verified: Source code archive and documentation comply with university standards.' 
        : 'Incomplete package: Missing SQL seed script or setup guide.';
      
      const result = await projectService.moderateProject(id, status, feedback);
      setActionSuccess(result.message || `Project #${id} has been ${status.toUpperCase()}.`);
      fetchModerationQueue();
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to moderate project.');
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-gold-soft text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Quality Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready-Made Project Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inspect source code completeness, database schemas, and IEEE SRS documentation before publishing to the live marketplace.
          </p>
        </div>
        <Link to="/admin/projects/new">
          <Button size="sm" variant="primary">Add Ready-Made Project</Button>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-ivory border border-gold-soft rounded-xl text-xs text-navy flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div role="alert" className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
          <button
            type="button"
            onClick={fetchModerationQueue}
            className="ml-auto font-semibold underline"
          >
            Retry
          </button>
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
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Review ({projects.filter(p => p.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'approved' ? 'bg-gold text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Approved & Live ({projects.filter(p => p.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rejected ({projects.filter(p => p.status === 'rejected').length})
        </button>
      </div>

      {/* Projects Moderation List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading project moderation queue...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
          No projects found in this moderation queue.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((proj) => (
            <div 
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-start justify-between gap-6"
            >
              {/* Left Column: Details & Package Checklist */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">{proj.title}</span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    proj.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : proj.status === 'rejected' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="font-semibold text-navy bg-ivory px-2 py-0.5 rounded">
                    {proj.degree} &bull; Sem {proj.semester}
                  </span>
                  <span className="font-medium text-slate-700">{proj.subject}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span>Listed Price: <strong className="text-slate-900">Rs. {Number(proj.price_pkr).toLocaleString()} PKR</strong></span>
                  <span className="text-slate-400">&bull;</span>
                  <span>Seller: <strong>{proj.seller?.name || proj.seller?.full_name || 'Muhammad Usman'}</strong> ({proj.seller?.university || 'FAST-NUCES'})</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {proj.summary}
                </p>

                {/* Package Checklist Display */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                    Included Deliverables Sanity Check:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {proj.package_includes?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Installation guide preview */}
                <div className="text-[11px] text-slate-500 font-mono bg-slate-900 text-gold-soft p-2.5 rounded-lg max-w-2xl overflow-x-auto">
                  Run guide: {proj.installation_guide}
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0">
                <Link to={`/admin/projects/${proj.id}`} className="w-full sm:w-auto">
                  <Button size="sm" variant="outline" className="w-full text-xs" rightIcon={<ExternalLink className="w-3 h-3" />}>
                    View Project Details
                  </Button>
                </Link>

                {proj.status === 'pending' ? (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full sm:w-auto text-xs"
                      onClick={() => handleModerateAction(proj.id, 'approved')}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Approve & Publish to Marketplace
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="w-full sm:w-auto text-xs"
                      onClick={() => handleModerateAction(proj.id, 'rejected')}
                      leftIcon={<XCircle className="w-4 h-4" />}
                    >
                      Reject Listing
                    </Button>
                  </>
                ) : (
                  <div className="text-right text-xs text-slate-500">
                    <div>Status: <strong className="capitalize text-slate-800">{proj.status}</strong></div>
                    {proj.moderation_feedback && (
                      <div className="text-[11px] text-slate-400 mt-0.5 max-w-xs">{proj.moderation_feedback}</div>
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

export default ProjectModeration;
