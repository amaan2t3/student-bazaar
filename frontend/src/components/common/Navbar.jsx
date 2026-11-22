import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-icon.jpeg';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Sparkles,
  UserCircle,
  LogOut,
  ChevronDown,
  ShieldCheck,
  FolderCheck,
  ClipboardCheck,
  UserCheck,
  MessageSquare,
  Users,
  Settings,
  PlusCircle,
  DownloadCloud,
  Layers,
  HelpCircle,
  Mail,
  Shield,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from './Button';

export const Navbar = () => {
  const { user, role, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoutError, setLogoutError] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await logout();
      setUserDropdownOpen(false);
      navigate('/');
    } catch (error) {
      setLogoutError(error.message || 'Unable to sign out. Please try again.');
    }
  };

  // Brand Palette
  const MIDNIGHT_NAVY = '#101827';
  const GOLD = '#D6B779';
  const BORDER = '#E5E1D8';

  const publicNavLinkClasses = ({ isActive }) =>
    `px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
      isActive
        ? 'bg-slate-900 text-[#D6B779] shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const adminNavLinkClasses = ({ isActive }) =>
    `px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
      isActive
        ? 'bg-[#101827] text-[#D6B779] shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs" style={{ borderBottom: `1px solid ${BORDER}` }}>

      {/* ── 1. Top Announcement Bar (Full Screen Width) ── */}
      <div style={{ backgroundColor: MIDNIGHT_NAVY }} className="w-full text-white text-[11px] sm:text-xs py-1.5 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full flex items-center justify-between gap-4">
          {role === 'admin' ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold tracking-wide" style={{ color: GOLD }}>ADMINISTRATION GOVERNANCE CONSOLE</span>
              <span className="text-slate-400 hidden md:inline">&bull; Platform Moderation, Catalog Management &amp; Inquiries</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D6B779] shrink-0 animate-pulse" />
              <span className="font-bold text-[#D6B779] tracking-wide uppercase text-[10px] sm:text-xs">
                Official University Hub:
              </span>
              <span className="text-slate-300 truncate hidden sm:inline">
                FAST-NUCES &bull; NUST &bull; PUCIT &bull; COMSATS &bull; UET &bull; GIKI &bull; NED
              </span>
            </div>
          )}

          {logoutError && (
            <span role="alert" className="text-xs text-red-400 font-medium">{logoutError}</span>
          )}

          <div className="flex items-center gap-4 shrink-0 text-slate-300">
            {role !== 'admin' && (
              <span className="hidden lg:inline text-slate-300">
                Verified Currency: <strong className="text-white font-bold">PKR (Rs)</strong>
              </span>
            )}
            <Link to="/academic-integrity" className="text-slate-300 hover:text-white transition-colors underline hidden sm:inline">
              Academic Policy
            </Link>
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors hidden sm:inline">
              Support
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Main Navigation Bar (Full Screen Width: w-full px-4 sm:px-6 lg:px-8 xl:px-12) ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-6">

          {/* Brand Logo & Title */}
          <Link
            to={role === 'admin' ? '/admin/dashboard' : '/'}
            className="flex items-center gap-3 shrink-0 group focus:outline-none"
          >
            <img
              src={logo}
              alt="StudentBazaar Logo"
              className="h-10 w-10 object-contain rounded-xl border border-slate-200/80 shadow-xs group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-black">
                Student<span style={{ color: GOLD }}>Bazaar</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#D6B779] mt-0.5">
                {role === 'admin' ? 'Admin Portal' : 'Academic Marketplace'}
              </span>
            </div>
          </Link>

          {/* Search bar (Full-width responsive placement for public visitors) */}
          {role !== 'admin' && (
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative flex-1 max-w-xs 2xl:max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, degrees, or topics..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-slate-200 focus:border-[#D6B779] rounded-full placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D6B779]/30 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>
          )}

          {/* Desktop Nav Links (Full Width Centered Layout) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {role === 'admin' ? (
              <>
                <NavLink to="/admin/dashboard" className={adminNavLinkClasses}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Control Panel</span>
                </NavLink>
                <NavLink to="/admin/projects" className={adminNavLinkClasses}>
                  <FolderCheck className="w-3.5 h-3.5" />
                  <span>Projects</span>
                </NavLink>
                <NavLink to="/admin/custom-requests" className={adminNavLinkClasses}>
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Requests</span>
                </NavLink>
                <NavLink to="/admin/seller-applications" className={adminNavLinkClasses}>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Applications</span>
                </NavLink>
                <NavLink to="/admin/contact-messages" className={adminNavLinkClasses}>
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Messages</span>
                </NavLink>
                <NavLink to="/admin/team" className={adminNavLinkClasses}>
                  <Users className="w-3.5 h-3.5" />
                  <span>Our Team</span>
                </NavLink>
                <NavLink to="/admin/contact-settings" className={adminNavLinkClasses}>
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/browse" className={publicNavLinkClasses}>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Browse Projects</span>
                </NavLink>

                <NavLink to="/custom-request" className={publicNavLinkClasses}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Custom Request</span>
                </NavLink>

                {role === 'seller' ? (
                  <>
                    <NavLink to="/seller/my-projects" className={publicNavLinkClasses}>
                      <FolderCheck className="w-3.5 h-3.5" />
                      <span>My Projects</span>
                    </NavLink>
                    <NavLink
                      to="/seller/add-project"
                      className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#D6B779] hover:bg-[#B8933A] text-[#101827] shadow-xs transition-colors flex items-center gap-1 ml-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Upload Project</span>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/my-downloads" className={publicNavLinkClasses}>
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>My Downloads</span>
                    </NavLink>
                    <NavLink
                      to="/become-seller"
                      className="px-3 py-1.5 text-xs font-bold rounded-full border border-[#D6B779] text-[#101827] bg-[#F8F5ED]/80 hover:bg-[#D6B779] hover:text-[#101827] transition-all ml-1"
                    >
                      Become a Seller
                    </NavLink>
                  </>
                )}

                <NavLink to="/how-it-works" className={publicNavLinkClasses}>
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How It Works</span>
                </NavLink>

                <NavLink to="/team" className={publicNavLinkClasses}>
                  <Users className="w-3.5 h-3.5" />
                  <span>Our Team</span>
                </NavLink>

                <NavLink to="/contact" className={publicNavLinkClasses}>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Section: Cart + Account & Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {role !== 'admin' && (
              <Link
                to="/browse"
                className="relative p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                title="Cart &amp; Orders"
              >
                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                    style={{ backgroundColor: GOLD, color: MIDNIGHT_NAVY }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative flex items-center pl-2 border-l border-slate-200">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <div className="hidden md:block text-right">
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                      {user.full_name || user.name}
                    </div>
                    <div className="text-[10px] font-bold text-amber-600 uppercase">
                      {user.university || role}
                    </div>
                  </div>
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D6B779] ring-offset-2 shadow-xs"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 text-xs"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 text-sm truncate">{user.full_name || user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</div>
                      <div className="mt-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block bg-[#F8F5ED] text-slate-800 border border-[#D6B779]/40">
                        {role.toUpperCase()} ACCOUNT
                      </div>
                    </div>

                    <div className="py-1">
                      {role === 'admin' ? (
                        <>
                          <Link to="/admin/dashboard" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium">
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <span>Control Panel</span>
                          </Link>
                          <Link to="/admin/contact-messages" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            <span>Inquiries Inbox</span>
                          </Link>
                          <Link to="/admin/team" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>Manage Our Team</span>
                          </Link>
                          <Link to="/admin/contact-settings" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium">
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span>Contact Settings</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/my-downloads" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium">
                            <DownloadCloud className="w-4 h-4 text-slate-400" />
                            <span>My Downloads</span>
                          </Link>
                          <Link to="/custom-request" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Custom Project Requests</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link to="/login">
                  <button className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 text-xs font-extrabold rounded-full bg-[#101827] text-[#D6B779] hover:bg-[#1B2940] shadow-sm transition-all">
                    Register
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* ── 3. Mobile Drawer Navigation (Full Width) ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 px-2 space-y-4 bg-white" style={{ borderColor: BORDER }}>
            {role !== 'admin' && (
              <form onSubmit={handleSearchSubmit} className="relative px-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6B779] border border-slate-200"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-5 top-3.5 pointer-events-none" />
              </form>
            )}

            <div className="space-y-1">
              {(role === 'admin'
                ? [
                    { to: '/admin/dashboard', label: 'Control Panel', icon: ShieldCheck },
                    { to: '/admin/projects', label: 'Ready-Made Projects', icon: FolderCheck },
                    { to: '/admin/custom-requests', label: 'Buyer Requests', icon: ClipboardCheck },
                    { to: '/admin/seller-applications', label: 'Seller Applications', icon: UserCheck },
                    { to: '/admin/contact-messages', label: 'Contact Messages', icon: MessageSquare },
                    { to: '/admin/team', label: 'Manage Our Team', icon: Users },
                    { to: '/admin/contact-settings', label: 'Contact Settings', icon: Settings }
                  ]
                : [
                    { to: '/browse', label: 'Browse Projects', icon: Layers },
                    { to: '/custom-request', label: 'Custom Project Request', icon: Sparkles },
                    { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
                    { to: '/academic-integrity', label: 'Academic Integrity', icon: Shield },
                    { to: '/team', label: 'Our Team', icon: Users },
                    { to: '/contact', label: 'Contact Us', icon: Mail },
                    ...(role === 'seller' ? [
                      { to: '/seller/my-projects', label: 'My Projects', icon: FolderCheck },
                      { to: '/seller/add-project', label: '+ Upload Project', icon: PlusCircle }
                    ] : []),
                    ...(role === 'buyer' ? [
                      { to: '/my-downloads', label: 'My Downloads', icon: DownloadCloud },
                      { to: '/become-seller', label: 'Become a Seller', icon: UserCheck }
                    ] : [])
                  ]
              ).map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#101827] text-[#D6B779]'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-slate-200 px-2 flex gap-3">
              {!user ? (
                <>
                  <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="primary" size="sm">Register</Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2 font-bold"
                  onClick={() => { void handleLogout(); setMobileMenuOpen(false); }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
