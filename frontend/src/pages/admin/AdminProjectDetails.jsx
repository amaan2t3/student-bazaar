import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Package, ShieldCheck } from 'lucide-react';
import projectService from '../../services/projectService';
import Button from '../../components/common/Button';

const formatPKR = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`;

export const AdminProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await projectService.getAdminProject(id);
      setProject(response.data);
    } catch (loadError) {
      setError(typeof loadError === 'string' ? loadError : 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  if (loading) {
    return <main className="p-12 text-center text-sm text-slate-500">Loading project details…</main>;
  }

  if (error || !project) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error || 'Project not found.'}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={loadProject}>Retry</Button>
          <Link to="/admin/projects"><Button type="button" variant="primary">Back to Projects</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-navy">
          <ArrowLeft className="w-4 h-4" />
          Back to Ready-Made Projects
        </Link>
        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
          project.status === 'approved'
            ? 'bg-green-100 text-green-800'
            : project.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
        }`}>
          {project.status}
        </span>
      </header>

      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {project.screenshots?.[0] && (
          <img
            src={project.screenshots[0]}
            alt=""
            className="w-full max-h-96 object-cover bg-slate-100"
          />
        )}
        <div className="p-5 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy bg-ivory px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Project Review
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{project.title}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {project.degree} · Semester {project.semester} · {project.subject}
              </p>
            </div>
            <p className="text-xl font-extrabold text-slate-900">{formatPKR(project.price_pkr)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <p><span className="text-slate-500">Category:</span> <strong>{project.category}</strong></p>
            <p><span className="text-slate-500">Difficulty:</span> <strong className="capitalize">{project.difficulty}</strong></p>
            <p><span className="text-slate-500">Seller:</span> <strong>{project.seller?.full_name || 'Platform admin'}</strong></p>
            <p><span className="text-slate-500">University:</span> <strong>{project.seller?.university || '—'}</strong></p>
          </div>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900">Summary</h2>
            <p className="text-sm text-slate-600 whitespace-pre-line">{project.summary}</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900">Full Description</h2>
            <p className="text-sm text-slate-600 whitespace-pre-line">{project.detailed_description}</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).map((technology) => (
                <span key={technology} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-700">{technology}</span>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900">Included Package</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(project.package_includes || []).map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {item.name}
                </div>
              ))}
            </div>
            {!project.package_includes?.length && (
              <p className="text-sm text-slate-500">No package contents were listed.</p>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900">System Requirements</h2>
            <ul className="list-disc list-inside text-sm text-slate-600">
              {(project.system_prerequisites || []).map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900">Installation Guide</h2>
            <pre className="whitespace-pre-wrap rounded-xl bg-slate-900 text-slate-100 p-4 text-xs">{project.installation_guide}</pre>
          </section>

          {project.moderation_feedback && (
            <p className="border-t border-slate-100 pt-4 text-sm text-slate-600">
              Admin feedback: {project.moderation_feedback}
            </p>
          )}

          <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-mid">
            <Package className="w-4 h-4" />
            Return to project queue
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AdminProjectDetails;
