import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileCode2, 
  Database, 
  FileText, 
  Terminal, 
  ShoppingBag, 
  ExternalLink,
  AlertCircle,
  Copy,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const MyDownloads = () => {
  const { user, role, switchRole } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Active signed URL vault states: { [projectId]: { signedUrl, expiresAt, secondsRemaining } }
  const [activeTokens, setActiveTokens] = useState({});
  const [generatingForId, setGeneratingForId] = useState(null);

  const fetchPurchases = () => {
    setLoading(true);
    orderService.getMyPurchases()
      .then(res => {
        setPurchases(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(typeof err === 'string' ? err : 'Failed to load purchased packages.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  // Request 15-Minute Signed Download URL
  const handleGenerateSignedUrl = async (projectId, projectTitle) => {
    setGeneratingForId(projectId);
    setError('');
    try {
      const res = await orderService.getSecureDownloadUrl(projectId);
      const { signedUrl, expiresInSeconds, fileName } = res.data;

      setActiveTokens(prev => ({
        ...prev,
        [projectId]: {
          signedUrl,
          secondsRemaining: expiresInSeconds,
          fileName,
          title: projectTitle
        }
      }));

      setGeneratingForId(null);
    } catch (err) {
      setGeneratingForId(null);
      setError(typeof err === 'string' ? err : 'Failed to generate signed download token.');
    }
  };

  // Timer tick for active signed tokens
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTokens(prev => {
        const next = {};
        Object.keys(prev).forEach(key => {
          if (prev[key].secondsRemaining > 1) {
            next[key] = {
              ...prev[key],
              secondsRemaining: prev[key].secondsRemaining - 1
            };
          }
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-soft/30 text-navy text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Digital Assets Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Purchased Project Downloads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your licensed project packages. Downloads are served via secure, time-expiring cryptographic signed URLs.
          </p>
        </div>

        {role === 'guest' && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2 text-xs text-amber-800">
            <span>Please login as a student buyer to view your library.</span>
            <Button size="sm" variant="secondary" onClick={() => switchRole('buyer')}>
              Switch to Buyer Persona
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Security Info Card */}
      <div className="bg-navy-dark text-gold-soft p-4 rounded-xl border border-navy-mid flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-gold-soft shrink-0" />
          <span>
            <strong>Anti-Piracy Security Vault:</strong> Download tokens expire in 15 minutes. You can regenerate a new token at any time with perpetual access.
          </span>
        </div>
        <span className="font-mono text-gold-soft shrink-0">TLS 1.3 &bull; SHA-256 HMAC</span>
      </div>

      {/* Purchases List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your purchased packages...</div>
      ) : purchases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No purchased projects yet</h3>
          <p className="text-xs text-slate-500">
            Explore our curated catalog to purchase semester projects with complete IEEE documentation.
          </p>
          <Link to="/browse">
            <Button variant="primary" size="sm">
              Browse Marketplace Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((order) => {
            const proj = order.project || {};
            const projectId = proj.id || order.project_id;
            const activeToken = activeTokens[projectId];

            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col lg:flex-row items-start justify-between gap-6"
              >
                {/* Left Column: Project Metadata */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{proj.title}</span>
                    <span className="bg-ivory text-navy font-semibold text-[10px] px-2 py-0.5 rounded border border-gold-soft">
                      PAID & LICENSED
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="font-semibold text-navy-mid bg-ivory px-2 py-0.5 rounded">
                      {proj.degree} &bull; Sem {proj.semester}
                    </span>
                    <span>Course: <strong>{proj.subject}</strong></span>
                    <span className="text-slate-400">&bull;</span>
                    <span>Order: <strong className="font-mono text-slate-900">{order.order_number}</strong></span>
                    <span className="text-slate-400">&bull;</span>
                    <span>Amount: <strong>Rs. {Number(order.total_amount_pkr).toLocaleString()} PKR</strong></span>
                  </div>

                  {/* Included Deliverables Pills */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                      Included in Your Download Archive:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>Runnable Source Code (.zip)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>Database Script (.sql / schema)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>Complete SRS Documentation (PDF)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>Viva Defense Presentation Slides</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Signed Token Alert if generated */}
                  {activeToken && (
                    <div className="bg-ivory border border-emerald-300 p-4 rounded-xl text-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-navy-mid animate-pulse" />
                          <span>Signed Token Active: {formatTimer(activeToken.secondsRemaining)}</span>
                        </span>
                        <span className="text-[10px] text-navy-mid font-medium">Auto-expires for security</span>
                      </div>
                      <div className="font-mono text-[11px] text-emerald-900 bg-white p-2 rounded border border-gold-soft truncate">
                        {activeToken.signedUrl}
                      </div>
                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={activeToken.signedUrl}
                          download={activeToken.fileName}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading ${activeToken.fileName} directly from secure signed cloud storage...`);
                          }}
                          className="px-3 py-1.5 bg-gold hover:bg-navy-mid text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Save Archive to Disk (.zip)</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="md"
                    isLoading={generatingForId === projectId}
                    onClick={() => handleGenerateSignedUrl(projectId, proj.title)}
                    className="w-full sm:w-auto shadow-md text-xs sm:text-sm"
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    {activeToken ? 'Regenerate Signed Token' : 'Generate Secure Download Link'}
                  </Button>

                  <Link to={`/project/${proj.slug}`} target="_blank" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full text-xs" rightIcon={<ExternalLink className="w-3 h-3" />}>
                      View Setup Guide
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyDownloads;
