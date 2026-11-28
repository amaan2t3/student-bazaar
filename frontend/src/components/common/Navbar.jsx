import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo-Icon.png';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
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
  Shield
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

  const navLinkClass = ({ isActive }) =>
    `px-2.5 xl:px-3 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap inline-flex items-center ${
      isActive
        ? 'text-slate-900 bg-slate-100 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  const adminNavLinkClass = ({ isActive }) =>
    `px-2.5 xl:px-3 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap inline-flex items-center ${
      isActive
        ? 'text-slate-900 bg-slate-100 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/90 shadow-subtle">
      {/* ── 1. Top Continuously Scrolling Horizontal Announcement Ticker ── */}
      <div className="w-full bg-slate-950 text-slate-200 text-xs py-1.5 border-b border-slate-800 overflow-hidden relative select-none">
        <div className="animate-ticker flex items-center gap-8 font-medium whitespace-nowrap text-[11px] sm:text-xs">
          <span><strong>Semester Fall 2026:</strong> 150+ verified computing projects with runnable code &amp; IEEE SRS documentation</span>
          <span className="text-[#C89D42]">&bull;</span>
          <span><strong>Promo:</strong> Use code <span className="text-[#C89D42] font-mono font-bold">SEMESTER20</span> for 20% off verified project packages</span>
          <span className="text-[#C89D42]">&bull;</span>
          <span><strong>Viva-Ready Guarantee:</strong> Complete DB schemas, ERD diagrams, and PowerPoint defense slides included</span>
          <span className="text-[#C89D42]">&bull;</span>
          <span><strong>Student Sellers:</strong> Monetize your university coursework and earn up to Rs. 25,000/mo</span>
          <span className="text-[#C89D42]">&bull;</span>
          {/* Continuous Duplicate Set for Smooth Infinity Loop */}
          <span><strong>Semester Fall 2026:</strong> 150+ verified computing projects with runnable code &amp; IEEE SRS documentation</span>
          <span className="text-[#C89D42]">&bull;</span>
          <span><strong>Promo:</strong> Use code <span className="text-[#C89D42] font-mono font-bold">SEMESTER20</span> for 20% off verified project packages</span>
          <span className="text-[#C89D42]">&bull;</span>
          <span><strong>Viva-Ready Guarantee:</strong> Complete DB schemas, ERD diagrams, and PowerPoint defense slides included</span>
          <span className="text-[#C89D42]">&bull;</span>
          <span><strong>Student Sellers:</strong> Monetize your university coursework and earn up to Rs. 25,000/mo</span>
          <span className="text-[#C89D42]">&bull;</span>
        </div>
      </div>

      {/* ── 2. Main Standard-Height Navigation Bar ── */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-6 xl:gap-8 min-w-0">
            <Link
              to={role === 'admin' ? '/admin/dashboard' : '/'}
              className="flex items-center gap-3 shrink-0 group focus:outline-none"
            >
              <img
                src={logo}
                alt="StudentBazaar Logo"
                className="h-11 w-11 object-contain rounded-lg border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Student<span className="text-[#C89D42]">Bazaar</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {role === 'admin' ? 'Admin Portal' : 'Academic Marketplace'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Pure clean text without prefix icon clutter) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
              {role === 'admin' ? (
                <>
                  <NavLink to="/admin/dashboard" className={adminNavLinkClass}>Control Panel</NavLink>
                  <NavLink to="/admin/projects" className={adminNavLinkClass}>Projects</NavLink>
                  <NavLink to="/admin/custom-requests" className={adminNavLinkClass}>Requests</NavLink>
                  <NavLink to="/admin/seller-applications" className={adminNavLinkClass}>Applications</NavLink>
                  <NavLink to="/admin/contact-messages" className={adminNavLinkClass}>Messages</NavLink>
                  <NavLink to="/admin/team" className={adminNavLinkClass}>Team</NavLink>
                  <NavLink to="/admin/contact-settings" className={adminNavLinkClass}>Settings</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/browse" className={navLinkClass}>Browse Projects</NavLink>
                  <NavLink to="/custom-request" className={navLinkClass}>Custom Request</NavLink>
                  
                  {role === 'seller' ? (
                    <>
                      <NavLink to="/seller/my-projects" className={navLinkClass}>My Projects</NavLink>
                      <NavLink
                        to="/seller/add-project"
                        className="px-3 py-2 text-sm font-semibold rounded-lg bg-[#F5EFE6] text-[#8C6B23] border border-[#E8DBC5] hover:bg-[#E8DBC5] transition-colors whitespace-nowrap inline-flex items-center ml-1"
                      >
                        + Upload Project
                      </NavLink>
                    </>
                  ) : (
                    <>
                      {user && (
                        <NavLink to="/my-downloads" className={navLinkClass}>My Downloads</NavLink>
                      )}
                      <NavLink
                        to="/become-seller"
                        className="px-2.5 xl:px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors whitespace-nowrap inline-flex items-center"
                      >
                        Become a Seller
                      </NavLink>
                    </>
                  )}

                  <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
                  <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Group: Search, Cart & Account/Auth Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {role !== 'admin' && (
              <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative w-44 2xl:w-60 shrink-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-8 pr-6 py-1.5 text-xs xl:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-lg placeholder:text-slate-400 focus:outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2 xl:top-2.5 pointer-events-none" />
                <div className="absolute right-2 top-1.5 xl:top-2 flex items-center pointer-events-none text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                  /
                </div>
              </form>
            )}

            {role !== 'admin' && (
              <Link
                to="/browse"
                className="relative p-2.5 rounded-lg border border-slate-200/90 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors shrink-0"
                title="Cart &amp; Orders"
                aria-label="View shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center bg-slate-900 text-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative flex items-center pl-3 border-l border-slate-200">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-semibold text-slate-900 truncate max-w-[130px]">
                      {user.full_name || user.name}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      {role}
                    </div>
                  </div>
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-14 w-60 bg-white rounded-lg shadow-elevated border border-slate-200 py-2 z-50 text-sm"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="font-semibold text-slate-900 truncate">{user.full_name || user.name}</div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{user.email}</div>
                    </div>

                    <div className="py-1.5">
                      {role === 'admin' ? (
                        <>
                          <Link to="/admin/dashboard" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700">
                             <span>Control Panel</span>
                          </Link>
                          <Link to="/admin/contact-messages" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700">
                             <span>Inquiries Inbox</span>
                          </Link>
                          <Link to="/admin/team" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>Manage Team</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/my-downloads" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700">
                             <span>My Downloads</span>
                          </Link>
                          <Link to="/custom-request" className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700">
                             <span>Custom Requests</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                      >
                         <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                <Link to="/login">
                  <span className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                    Sign In
                  </span>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* ── 3. Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-3 bg-white">
            {role !== 'admin' && (
              <form onSubmit={handleSearchSubmit} className="relative pb-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 rounded-lg focus:outline-none focus:border-slate-400 border border-slate-200"
                />
               </form>
            )}

            <div className="space-y-1">
              {(role === 'admin'
                ? [
                    { to: '/admin/dashboard', label: 'Control Panel', icon: ShieldCheck },
                    { to: '/admin/projects', label: 'Projects Moderation', icon: FolderCheck },
                    { to: '/admin/custom-requests', label: 'Buyer Requests', icon: ClipboardCheck },
                    { to: '/admin/seller-applications', label: 'Seller Applications', icon: UserCheck },
                    { to: '/admin/contact-messages', label: 'Contact Messages', icon: MessageSquare },
                    { to: '/admin/team', label: 'Our Team', icon: Users },
                    { to: '/admin/contact-settings', label: 'Contact Settings', icon: Settings }
                  ]
                : [
                    { to: '/browse', label: 'Browse Projects', icon: Layers },
                    { to: '/custom-request', label: 'Custom Project Request', icon: Shield },
                    { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
                    { to: '/academic-integrity', label: 'Academic Integrity', icon: Shield },
                    { to: '/team', label: 'Our Team', icon: Users },
                    { to: '/contact', label: 'Contact Us', icon: Mail },
                    ...(role === 'seller' ? [
                      { to: '/seller/my-projects', label: 'My Projects', icon: FolderCheck },
                      { to: '/seller/add-project', label: 'Upload Project', icon: PlusCircle }
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
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              {!user ? (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline" size="md">Sign In</Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="primary" size="md">Register</Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 flex items-center justify-center gap-2"
                  onClick={() => { void handleLogout(); setMobileMenuOpen(false); }}
                >
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
