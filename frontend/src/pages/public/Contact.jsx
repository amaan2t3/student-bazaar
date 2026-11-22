import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import contactService from '../../services/contactService';
import Button from '../../components/common/Button';

export const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    headline: 'Get in Touch with studentBazaar',
    subheadline: 'Have questions about semester projects, custom assignments, or seller verification? We are here to support your academic journey.',
    email: 'support@studentbazaar.pk',
    phone: '+92 300 1234567',
    address: 'FAST-NUCES Student Hub / CS Department, Lahore, Pakistan',
    office_hours: 'Monday to Saturday, 9:00 AM – 7:00 PM (PKT)',
    response_time: 'Usually replies within 2–4 hours during campus hours.',
    social_links: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com'
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    contactService.getContactInfo()
      .then((res) => {
        if (active && res.data) {
          setContactInfo((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => {
        console.warn('Could not load custom contact info, using defaults:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      await contactService.submitMessage(formData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err) {
      setErrorMessage(typeof err === 'string' ? err : 'Unable to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ── Page Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] text-[#D6B779] text-xs font-semibold tracking-wide uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            Support &amp; Community Hub
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {contactInfo.headline}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {contactInfo.subheadline}
          </p>
        </div>

        {/* ── Main Contact Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Direct Info & Campus Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#101827] text-white rounded-3xl p-8 shadow-xl border border-slate-800 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#D6B779]/10 blur-2xl pointer-events-none" />

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Contact Information</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Reach out directly or visit our student liaisons at university partner campuses.
                </p>
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#D6B779]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Email Us</span>
                    <a href={`mailto:${contactInfo.email}`} className="text-white font-semibold hover:text-[#D6B779] transition-colors break-all">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#D6B779]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Phone / WhatsApp</span>
                    <a href={`tel:${contactInfo.phone}`} className="text-white font-semibold hover:text-[#D6B779] transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#D6B779]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Campus Hub</span>
                    <p className="text-white font-medium">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#D6B779]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Operating Hours</span>
                    <p className="text-white font-medium">{contactInfo.office_hours}</p>
                    <p className="text-xs text-[#D6B779] mt-0.5">{contactInfo.response_time}</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-6 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck className="w-5 h-5 text-[#D6B779] shrink-0" />
                <span>
                  All inquiries sent here appear live on the administrative moderation console for swift resolution.
                </span>
              </div>
            </div>

            {/* Quick Campus FAQ Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D6B779]" />
                Frequently Asked
              </h4>
              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <p className="font-semibold text-slate-800">How do I verify as a Seller?</p>
                  <p className="mt-0.5">Go to "Become a Seller" and submit your student ID card along with your active GitHub profile.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Can I request milestone-based payments?</p>
                  <p className="mt-0.5">Yes, custom requests can be negotiated directly with approved sellers with escrow protection.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Fill out the form below. Once submitted, your message will immediately appear in the admin moderation dashboard.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-8 text-center bg-[#F8F5ED] border border-[#D6B779]/40 rounded-2xl space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you for contacting us. Your message has been logged in the Admin Control Panel. Our team will review and follow up with you via email shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-2"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ali Raza"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. name@student.edu.pk"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        WhatsApp / Phone <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 0000000"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Topic / Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779] focus:bg-white transition-all"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Custom Project Help">Custom Project Help</option>
                        <option value="Seller Account Verification">Seller Account Verification</option>
                        <option value="Order & Download Support">Order & Download Support</option>
                        <option value="Academic Integrity & Policy">Academic Integrity & Policy</option>
                        <option value="Technical Bug / Report">Technical Bug / Report</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Message Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe how we can help you in detail..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B779] focus:bg-white transition-all resize-y"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2 rounded-xl shadow-md"
                  >
                    {submitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message to Admin
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
