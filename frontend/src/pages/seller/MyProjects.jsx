import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink, 
  Star, 
  ShoppingBag,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import projectService from '../../services/projectService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const MyProjects = () => {
  const { role, switchRole } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSellerProjects = () => {
    setLoading(true);
    projectService.getSellerProjects()
      .then(res => {
        setProjects(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(typeof err === 'string' ? err : 'Failed to load projects.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellerProjects();
  }, []);

  const totalSales = projects.reduce((acc, p) => acc + (p.total_sales_count || 0), 0);
  const totalApproved = projects.filter(p => p.status === 'approved').length;
  const totalPending = projects.filter(p => p.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-soft/30 text-navy text-xs font-semibold mb-1">
            <Package className="w-3.5 h-3.5 text-gold" />
            <span>Seller Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Project Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your ready-made packages, track admin moderation status, and monitor sales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role !== 'seller' && role !== 'admin' && (
            <Button size="sm" variant="secondary" onClick={() => switchRole('seller')}>
              Switch to Seller Persona
            </Button>
          )}

          <Link to="/seller/add-project">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Add New Project
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block font-medium">Total Listings</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{projects.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block font-medium">Live on Marketplace</span>
          <span className="text-2xl font-bold text-gold mt-1 block">{totalApproved}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block font-medium">Under Admin Review</span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">{totalPending}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block font-medium">Total Packages Sold</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalSales}</span>
        </div>
      </div>

      {/* Projects Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your project catalog...</div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">You haven't listed any projects yet</h3>
          <p className="text-xs text-slate-500">
            Publish your completed semester projects and FYPs to start earning in PKR.
          </p>
          <Link to="/seller/add-project">
            <Button variant="primary" size="sm">
              Create Your First Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Curriculum</th>
                  <th className="py-3 px-4">Price (PKR)</th>
                  <th className="py-3 px-4">Sales / Rating</th>
                  <th className="py-3 px-4">Moderation Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        /{proj.slug}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-navy bg-ivory px-2 py-0.5 rounded text-[11px] border border-ivory-dark">
                        {proj.degree} &bull; Sem {proj.semester}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5">{proj.subject}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      Rs. {Number(proj.price_pkr).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-semibold text-slate-900">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proj.total_sales_count || 0} sold</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{Number(proj.average_rating || 0).toFixed(1)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        proj.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : proj.status === 'rejected' 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {proj.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                        {proj.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {proj.status === 'rejected' && <XCircle className="w-3 h-3 text-red-600" />}
                        <span>{proj.status}</span>
                      </span>

                      {proj.moderation_feedback && (
                        <div className="text-[10px] text-slate-400 mt-1 max-w-xs truncate">
                          Note: {proj.moderation_feedback}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link 
                        to={`/project/${proj.slug}`}
                        className="inline-flex items-center gap-1 text-gold hover:text-navy-mid font-semibold px-2.5 py-1 rounded hover:bg-ivory transition-colors"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyProjects;
