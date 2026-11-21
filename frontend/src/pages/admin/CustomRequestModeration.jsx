import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, ClipboardCheck, XCircle } from 'lucide-react';
import customRequestService from '../../services/customRequestService';
import Button from '../../components/common/Button';

const statusLabels = {
  pending_review: 'Pending review',
  open_for_bidding: 'Open for bidding',
  awarded: 'Awarded',
  completed: 'Completed',
  cancelled: 'Rejected'
};

export const CustomRequestModeration = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending_review');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await customRequestService.getAdminQueue();
      setRequests(response.data || []);
    } catch (requestError) {
      setError(typeof requestError === 'string' ? requestError : 'Failed to load buyer custom requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const moderateRequest = async (request, status) => {
    setActionId(request.id);
    setError('');
    setSuccess('');
    try {
      await customRequestService.moderate(
        request.id,
        status,
        status === 'open_for_bidding'
          ? 'Approved by admin and opened for seller bidding.'
          : 'Rejected by admin.'
      );
      setSuccess(`“${request.title}” ${status === 'open_for_bidding' ? 'approved for bidding' : 'rejected'}.`);
      await fetchRequests();
    } catch (requestError) {
      setError(typeof requestError === 'string' ? requestError : 'Failed to update buyer request.');
    } finally {
      setActionId(null);
    }
  };

  const filteredRequests = requests.filter((request) => (
    filterStatus === 'all' || request.status === filterStatus
  ));
  const pendingCount = requests.filter((request) => request.status === 'pending_review').length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <header className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-gold-soft text-xs font-semibold mb-2">
          <ClipboardCheck className="w-3.5 h-3.5" />
          Buyer Request Review
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Custom Project Requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review buyer requests. Approved requests become available to sellers for bidding.
        </p>
      </header>

      {success && (
        <div role="status" className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div role="alert" className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button
            type="button"
            onClick={fetchRequests}
            className="ml-auto font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        {[
          ['pending_review', `Pending review (${pendingCount})`],
          ['all', `All requests (${requests.length})`],
          ['open_for_bidding', 'Open for bidding'],
          ['cancelled', 'Rejected']
        ].map(([status, label]) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === status ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading buyer requests…</div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          No buyer requests in this queue.
        </div>
      ) : (
        <section className="space-y-4" aria-label="Buyer custom requests">
          {filteredRequests.map((request) => (
            <article key={request.id} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">{request.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {request.university || request.buyer?.university || 'University not specified'}
                    {' · '}{request.degree} · Semester {request.semester} · {request.subject}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  {statusLabels[request.status] || request.status}
                </span>
              </div>

              <p className="text-sm text-slate-700 whitespace-pre-line">{request.detailed_scope}</p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                <span>Level: <strong className="capitalize">{request.project_level || 'simple'}</strong></span>
                <span>Package: <strong>{request.deliverable_bundle || 'project_only'}</strong></span>
                <span>Estimated price: <strong>Rs. {Number(request.budget_pkr || 0).toLocaleString()} PKR</strong></span>
                <span>Deadline: <strong>{request.deadline}</strong></span>
                <span>Buyer: <strong>{request.buyer?.full_name || request.buyer?.name || 'Student buyer'}</strong></span>
              </div>

              {request.technologies_needed?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {request.technologies_needed.map((technology) => (
                    <span key={technology} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {technology}
                    </span>
                  ))}
                </div>
              )}

              {request.status === 'pending_review' && (
                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    isLoading={actionId === request.id}
                    disabled={actionId !== null}
                    onClick={() => moderateRequest(request, 'open_for_bidding')}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Approve & Open for Bidding
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    disabled={actionId !== null}
                    onClick={() => moderateRequest(request, 'cancelled')}
                    leftIcon={<XCircle className="w-4 h-4" />}
                  >
                    Reject Request
                  </Button>
                </div>
              )}

              {request.admin_feedback && (
                <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                  Admin note: {request.admin_feedback}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default CustomRequestModeration;
