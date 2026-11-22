import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Github,
  Twitter,
  GraduationCap,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  UploadCloud,
  Image as ImageIcon,
  Link2,
  Camera
} from 'lucide-react';
import teamService from '../../services/teamService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const initialForm = {
    name: '',
    role: '',
    university: '',
    bio: '',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    display_order: 1,
    is_active: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchMembers = () => {
    setLoading(true);
    teamService.getAdminTeamMembers()
      .then((res) => {
        setMembers(res.data || []);
      })
      .catch((err) => {
        setActionError(typeof err === 'string' ? err : 'Failed to load team members.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      ...initialForm,
      display_order: members.length + 1
    });
    setImageMode('upload');
    setUploadedFileName('');
    setUploadError('');
    setActionSuccess('');
    setActionError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    const avatar = member.avatar_url || '';
    setFormData({
      name: member.name || '',
      role: member.role || '',
      university: member.university || '',
      bio: member.bio || '',
      avatar_url: avatar,
      linkedin_url: member.linkedin_url || '',
      github_url: member.github_url || '',
      twitter_url: member.twitter_url || '',
      display_order: member.display_order ?? 1,
      is_active: member.is_active ?? true
    });

    if (avatar.startsWith('data:image')) {
      setImageMode('upload');
      setUploadedFileName('Custom Uploaded Image');
    } else {
      setImageMode('url');
      setUploadedFileName('');
    }
    setUploadError('');
    setActionSuccess('');
    setActionError('');
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageFileUpload = (e) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxDim = 500;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData((prev) => ({
          ...prev,
          avatar_url: optimizedDataUrl
        }));
        setUploadedFileName(file.name);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionSuccess('');
    setActionError('');

    try {
      if (editingMember) {
        await teamService.updateTeamMember(editingMember.id, formData);
        setActionSuccess(`Updated ${formData.name} successfully.`);
      } else {
        await teamService.createTeamMember(formData);
        setActionSuccess(`Added ${formData.name} to the team.`);
      }
      setModalOpen(false);
      fetchMembers();
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to save team member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the team?`)) return;
    try {
      await teamService.deleteTeamMember(id);
      setActionSuccess(`Removed ${name} successfully.`);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to delete team member.');
    }
  };

  const handleToggleStatus = async (member) => {
    try {
      const updated = !member.is_active;
      await teamService.updateTeamMember(member.id, { is_active: updated });
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_active: updated } : m))
      );
      setActionSuccess(`${member.name} is now ${updated ? 'active' : 'hidden from public'}.`);
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to update visibility.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-gold-soft text-xs font-semibold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Our Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control, edit, and add team members with image uploads or direct URLs displayed on the public Our Team page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMembers}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900">&times;</button>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-red-600 hover:text-red-900">&times;</button>
        </div>
      )}

      {/* Team Members List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
          Loading team members...
        </div>
      ) : members.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No team members added yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ Add Team Member" to add founders, developers, or campus ambassadors with photos or URLs.
          </p>
          <Button onClick={handleOpenAdd} size="sm">
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-2xl border ${
                member.is_active ? 'border-slate-200' : 'border-slate-300 bg-slate-50/50 opacity-75'
              } p-6 shadow-sm flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={member.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#D6B779] shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                      <p className="text-xs font-semibold text-[#D6B779]">{member.role}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <GraduationCap className="w-3 h-3" />
                        <span>{member.university}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 text-slate-600">
                      Order: #{member.display_order}
                    </span>
                    {member.is_active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="neutral">Hidden</Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>

                {/* Social icons */}
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.github_url && (
                    <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-500">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleStatus(member)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
                  title="Toggle Visibility"
                >
                  {member.is_active ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(member)}
                    className="text-xs px-2.5 py-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingMember ? `Edit Team Member: ${editingMember.name}` : 'Add New Team Member'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter details for this member and choose whether to upload an image file or provide a direct web URL.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Daniyal Khan"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Role / Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Founder & Full-Stack Architect"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    University / Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="university"
                    required
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="e.g. FAST-NUCES Lahore"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    min="1"
                    value={formData.display_order}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                  />
                </div>
              </div>

              {/* ── Photo Section: Option to Upload Image File or Enter URL ── */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Member Photo / Avatar
                  </label>

                  {/* Mode switcher tabs: Upload vs URL */}
                  <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode('upload');
                        setUploadError('');
                      }}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                        imageMode === 'upload'
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode('url');
                        setUploadError('');
                      }}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                        imageMode === 'url'
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {uploadError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {imageMode === 'upload' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      {/* Avatar Round Preview */}
                      <div className="relative shrink-0">
                        {formData.avatar_url ? (
                          <img
                            src={formData.avatar_url}
                            alt="preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#D6B779] shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                            <Camera className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Drop / Browse Area */}
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-slate-300 hover:border-[#D6B779] rounded-2xl p-3.5 text-center bg-white transition-all group">
                          <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-[#D6B779] mx-auto mb-1 transition-colors" />
                          <p className="text-xs font-bold text-slate-800">
                            Click to choose an image from your computer
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            PNG, JPG, JPEG, WebP up to 10MB (automatically optimized)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileUpload}
                        />
                      </label>
                    </div>

                    {uploadedFileName && (
                      <div className="flex items-center justify-between text-xs text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="truncate max-w-[240px] flex items-center gap-1.5 font-medium">
                          <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          {uploadedFileName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, avatar_url: '' }));
                            setUploadedFileName('');
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold"
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {formData.avatar_url ? (
                          <img
                            src={formData.avatar_url}
                            alt="preview"
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#D6B779] shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <Camera className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <input
                        type="url"
                        name="avatar_url"
                        value={formData.avatar_url}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/... or https://github.com/..."
                        className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Paste any public web link or CDN image URL. Live circular preview updates in real time.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bio / Background <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Short bio detailing technical achievements, academic focus..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D6B779]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    placeholder="https://twitter.com/..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="rounded text-[#D6B779] focus:ring-[#D6B779] w-4 h-4"
                />
                <label htmlFor="is_active" className="text-xs font-semibold text-slate-700">
                  Visible on public Our Team page
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamManagement;
