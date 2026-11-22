import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import contactService from '../../services/contactService';
import Button from '../../components/common/Button';

export const ContactSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    email: '',
    phone: '',
    address: '',
    office_hours: '',
    response_time: '',
    social_links: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: ''
    }
  });

  const fetchSettings = () => {
    setLoading(true);
    contactService.getAdminContactSettings()
      .then((res) => {
        if (res.data) {
          setFormData({
            headline: res.data.headline || '',
            subheadline: res.data.subheadline || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            office_hours: res.data.office_hours || '',
            response_time: res.data.response_time || '',
            social_links: {
              linkedin: res.data.social_links?.linkedin || '',
              github: res.data.social_links?.github || '',
              twitter: res.data.social_links?.twitter || '',
              instagram: res.data.social_links?.instagram || ''
            }
          });
        }
      })
      .catch((err) => {
        setActionError(typeof err === 'string' ? err : 'Failed to load contact settings.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionSuccess('');
    setActionError('');

    try {
      await contactService.updateContactSettings(formData);
      setActionSuccess('Contact page settings updated successfully. Changes are now live on /contact!');
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to update contact settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-gold-soft text-xs font-semibold mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Page Content &amp; Channels</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Page Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control the contact information, office address, operating hours, and banners shown to students on the public Contact page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
          >
            <span>View Public /contact</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <button
            onClick={fetchSettings}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900">&times;</button>
        </div>
      )}
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')} className="text-red-600 hover:text-red-900">&times;</button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200 shadow-sm">
          Loading settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Page Headline & Introduction */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              1. Header &amp; Subtitle Banners
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Main Page Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  required
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Get in Touch with studentBazaar"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subheadline / Description
                </label>
                <textarea
                  name="subheadline"
                  rows={3}
                  required
                  value={formData.subheadline}
                  onChange={handleChange}
                  placeholder="e.g. Have questions about semester projects..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Direct Contact Channels */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              2. Support Channels &amp; Office Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Primary Support Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="support@studentbazaar.pk"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Phone / WhatsApp Support
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Physical Campus Hub / Address
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="FAST-NUCES Student Hub / CS Department, Lahore, Pakistan"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Operating Hours
                </label>
                <input
                  type="text"
                  name="office_hours"
                  required
                  value={formData.office_hours}
                  onChange={handleChange}
                  placeholder="Monday to Saturday, 9:00 AM – 7:00 PM (PKT)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Expected Response Time
                </label>
                <input
                  type="text"
                  name="response_time"
                  required
                  value={formData.response_time}
                  onChange={handleChange}
                  placeholder="Usually replies within 2–4 hours during campus hours."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Social Links */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              3. Social Network Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.social_links.linkedin}
                  onChange={handleSocialChange}
                  placeholder="https://linkedin.com/company/studentbazaar"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.social_links.github}
                  onChange={handleSocialChange}
                  placeholder="https://github.com/studentbazaar"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.social_links.twitter}
                  onChange={handleSocialChange}
                  placeholder="https://twitter.com/studentbazaar"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.social_links.instagram}
                  onChange={handleSocialChange}
                  placeholder="https://instagram.com/studentbazaar"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 font-bold flex items-center gap-2 rounded-2xl shadow-md text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save & Publish Contact Settings'}
            </Button>
          </div>

        </form>
      )}

    </div>
  );
};

export default ContactSettings;
